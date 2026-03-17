import { Task, TaskStatus } from '../api/tasks';
import styles from './TaskCard.module.css';

const NEXT_STATUS: Record<TaskStatus, TaskStatus | null> = {
  OPEN: 'IN_PROGRESS',
  IN_PROGRESS: 'DONE',
  DONE: null,
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

interface Props {
  task: Task;
  onMove: (status: TaskStatus) => void;
  onDelete: () => void;
  isMoving: boolean;
  isDeleting: boolean;
}

export function TaskCard({ task, onMove, onDelete, isMoving, isDeleting }: Props) {
  const next = NEXT_STATUS[task.status];
  const isDone = task.status === 'DONE';
  const timeAgo = new Date(task.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className={`${styles.card} ${isDone ? styles.done : ''}`}>
      <p className={styles.title}>{task.title}</p>
      {task.description && (
        <p className={styles.desc}>{task.description}</p>
      )}
      <div className={styles.meta}>
        <span className={`${styles.tag} ${styles[task.status.toLowerCase().replace('_', '')]}`}>
          {STATUS_LABEL[task.status]}
        </span>
        <span className={styles.time}>{timeAgo}</span>
      </div>
      <div className={styles.actions}>
        {next && (
          <button
            className={styles.btnMove}
            onClick={() => onMove(next)}
            disabled={isMoving}
          >
            {isMoving ? '…' : `→ Move to ${STATUS_LABEL[next]}`}
          </button>
        )}
        <button
          className={styles.btnDelete}
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting ? '…' : '✕'}
        </button>
      </div>
    </div>
  );
}
