'use server';

import { auth } from 'app/auth';
import { updateReportStatus, createActionLog } from '@/lib/db/admin';
import { deleteEvaluation } from '@/lib/db/evaluations';

export interface AdminActionResult {
  success: boolean;
  error?: string;
}

export async function handleEvaluationAction(
  reportId: number,
  action: 'approve' | 'reject',
  evaluationId?: number
): Promise<AdminActionResult> {
  const session = await auth();

  if (!session?.user || session.user.role !== '관리자') {
    return {
      success: false,
      error: '관리자 권한이 필요합니다.',
    };
  }

  const adminId = parseInt(session.user.id as string);

  try {
    if (action === 'approve' && evaluationId) {
      // Delete the evaluation
      await deleteEvaluation(evaluationId);

      // Update report status
      await updateReportStatus(reportId, 'approved', adminId);

      // Log action
      await createActionLog({
        adminId,
        actionType: 'delete_evaluation',
        targetEvaluationId: evaluationId,
        reportId,
        reason: '신고 승인 및 평가 삭제',
      });
    } else if (action === 'reject') {
      // Reject the report
      await updateReportStatus(reportId, 'rejected', adminId);

      // Log action
      await createActionLog({
        adminId,
        actionType: 'dismiss_report',
        reportId,
        reason: '신고 거절',
      });
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('Admin action error:', error);
    return {
      success: false,
      error: '작업 처리 중 오류가 발생했습니다.',
    };
  }
}

export async function handleUserReportAction(
  reportId: number,
  action: 'dismiss' | 'warn' | 'suspend',
  targetUserId?: number
): Promise<AdminActionResult> {
  const session = await auth();

  if (!session?.user || session.user.role !== '관리자') {
    return {
      success: false,
      error: '관리자 권한이 필요합니다.',
    };
  }

  const adminId = parseInt(session.user.id as string);

  try {
    if (action === 'dismiss') {
      await updateReportStatus(reportId, 'rejected', adminId);
      await createActionLog({
        adminId,
        actionType: 'dismiss_report',
        reportId,
        reason: '신고 기각',
      });
    } else if (action === 'warn' && targetUserId) {
      await updateReportStatus(reportId, 'resolved', adminId);
      await createActionLog({
        adminId,
        actionType: 'warn_user',
        targetUserId,
        reportId,
        reason: '사용자 경고',
      });
    } else if (action === 'suspend' && targetUserId) {
      await updateReportStatus(reportId, 'resolved', adminId);
      await createActionLog({
        adminId,
        actionType: 'suspend_user',
        targetUserId,
        reportId,
        reason: '계정 정지',
      });
      // TODO: Implement actual user suspension
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error('User report action error:', error);
    return {
      success: false,
      error: '작업 처리 중 오류가 발생했습니다.',
    };
  }
}

