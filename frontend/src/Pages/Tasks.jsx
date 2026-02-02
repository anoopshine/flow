import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Tasks() {
    const { user, logout } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 🔄 Fetch tasks
    const fetchTasks = async () => {
        try {
            setLoading(true);
            const res = await api.get(
                "/tasks",
            );
            setTasks(res.data.tasks);
        } catch (err) {
            setError("Failed to load tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // ➕ Create task
    const createTask = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const res = await api.post(
                "/tasks",
                { title },
            );
            setTasks([res.data, ...tasks]);
            setTitle("");
        } catch {
            setError("Failed to create task");
        }
    };

    // ❌ Delete task
    const deleteTask = async (id) => {
        try {
            await api.delete(
                `/tasks/${id}`
            );
            setTasks(tasks.filter((t) => t._id !== id));
        } catch {
            setError("Failed to delete task");
        }
    };

    if (loading) return <p>Loading tasks...</p>;

    return (
        <div style={styles.container}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Welcome, {user?.name}</h2>
                <button onClick={logout}>Logout</button>
            </div>

            <form onSubmit={createTask} style={styles.form}>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="New task..."
                />
                <button>Add</button>
            </form>

            {error && <p style={styles.error}>{error}</p>}

            <ul style={styles.list}>
                {tasks.map((task) => (
                    <li key={task._id} style={styles.item}>
                        {task.title}
                        <button onClick={() => deleteTask(task._id)}>❌</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

const styles = {
    container: { maxWidth: 500, margin: "30px auto" },
    form: { display: "flex", gap: 10 },
    list: { marginTop: 20 },
    item: {
        display: "flex",
        justifyContent: "space-between",
        padding: 8,
        borderBottom: "1px solid #ddd",
    },
    error: { color: "red" },
};
