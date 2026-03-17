import { useState } from 'react';
import { useTasks, useCreateTask, useUpdateStatus, useDeleteTask } from '../hooks/useTasks';
import { TaskCard } from './TaskCard';
import { TaskStatus } from '../api/tasks';
import styles from './TaskBoard.module.css';

const COLUMNS: { status: TaskStatus; label: string }[] = [
  { status: 'OPEN', label: 'Open' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'DONE', label: 'Done' },
];

export function TaskBoard() {
  const { data: tasks = [], isLoading, isError } = useTasks();
  const createTask = useCreateTask();
  const updateStatus = useUpdateStatus();
  const deleteTask = useDeleteTask();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [showDesc, setShowDesc] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate(
      { title: title.trim(), description: description.trim() || undefined },
      { onSuccess: () => { setTitle(''); setDescription(''); setShowDesc(false); } },
    );
  };

  if (isError) {
    return (
      <div className={styles.error}>
        <p>Could not connect to the API.</p>
        <p className={styles.errorHint}>Make sure the NestJS server is running on port 3000.</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>TASK<span>/</span>BOARD</div>
        <span className={styles.badge}>NestJS + React</span>
      </header>

      {/* Add task form */}
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.formRow}>
          <input
            className={styles.input}
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="New task title…"
            disabled={createTask.isPending}
          />
          <button
            type="button"
            className={styles.btnToggleDesc}
            onClick={() => setShowDesc(v => !v)}
            title="Add description"
          >
            {showDesc ? '−' : '+'}
          </button>
          <button
            type="submit"
            className={styles.btnAdd}
            disabled={createTask.isPending || !title.trim()}
          >
            {createTask.isPending ? 'Adding…' : 'Add task'}
          </button>
        </div>
        {showDesc && (
          <input
            className={styles.input}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Optional description…"
            style={{ marginTop: 8 }}
          />
        )}
      </form>

      {/* Board columns */}
      <div className={styles.board}>
        {COLUMNS.map(col => {
          const colTasks = tasks.filter(t => t.status === col.status);
          return (
            <div key={col.status} className={styles.column}>
              <div className={styles.colHeader}>
                <span className={`${styles.colTitle} ${styles[col.status.toLowerCase().replace('_', '')]}`}>
                  {col.label}
                </span>
                <span className={styles.colCount}>{colTasks.length}</span>
              </div>

              {isLoading ? (
                <>
                  <div className={styles.skeleton} />
                  <div className={styles.skeleton} style={{ width: '75%' }} />
                </>
              ) : colTasks.length === 0 ? (
                <div className={styles.empty}>no tasks</div>
              ) : (
                colTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onMove={status => updateStatus.mutate({ id: task.id, status })}
                    onDelete={() => deleteTask.mutate(task.id)}
                    isMoving={updateStatus.isPending && updateStatus.variables?.id === task.id}
                    isDeleting={deleteTask.isPending && deleteTask.variables === task.id}
                  />
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
