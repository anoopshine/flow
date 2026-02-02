import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Categories() {
    const { user, logout } = useAuth();

    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [search, setSearch] = useState("");

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // 🔄 Fetch categories
    const fetchCategories = async (currentPage = 1) => {
        try {
            setLoading(true);

            const res = await api.get(
                `/categories?page=${currentPage}&limit=5&search=${search}`
            );

            setCategories(res.data.tasks); // backend key = tasks
            setPage(res.data.page);
            setPages(res.data.pages);
        } catch (err) {
            setError("Failed to load categories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories(page);
    }, [page, search]);

    // ➕ Create category
    const createCategory = async (e) => {
        e.preventDefault();
        if (!name.trim()) return;

        try {
            const res = await api.post("/categories", { name });
            setCategories([res.data, ...categories]);
            setName("");
        } catch {
            setError("Failed to create category");
        }
    };

    // ✏️ Update category
    const updateCategory = async (id, newName) => {
        try {
            const res = await api.put(`/categories/${id}`, {
                name: newName,
            });

            setCategories(
                categories.map((c) =>
                    c._id === id ? res.data : c
                )
            );
        } catch {
            setError("Failed to update category");
        }
    };

    // ❌ Delete category
    const deleteCategory = async (id) => {
        if (!confirm("Delete this category?")) return;

        try {
            await api.delete(`/categories/${id}`);
            setCategories(categories.filter((c) => c._id !== id));
        } catch {
            setError("Failed to delete category");
        }
    };

    if (loading) return <p>Loading categories...</p>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>Categories</h2>
                <div>
                    <span>{user?.name}</span>
                    <button onClick={logout}>Logout</button>
                </div>
            </div>

            {/* Create */}
            <form onSubmit={createCategory} style={styles.form}>
                <input
                    placeholder="New category name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button>Add</button>
            </form>

            {/* Search */}
            <input
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                }}
                style={{ marginTop: 10 }}
            />

            {error && <p style={styles.error}>{error}</p>}

            {/* List */}
            <ul style={styles.list}>
                {categories.map((cat) => (
                    <li key={cat._id} style={styles.item}>
                        <input
                            value={cat.name}
                            onChange={(e) =>
                                updateCategory(cat._id, e.target.value)
                            }
                        />
                        <button onClick={() => deleteCategory(cat._id)}>
                            ❌
                        </button>
                    </li>
                ))}
            </ul>

            {/* Pagination */}
            <div style={styles.pagination}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Prev
                </button>

                <span>
                    Page {page} of {pages}
                </span>

                <button
                    disabled={page === pages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>
            </div>
        </div>
    );
}

const styles = {
    container: { maxWidth: 600, margin: "30px auto" },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    form: { display: "flex", gap: 10, marginTop: 15 },
    list: { marginTop: 20 },
    item: {
        display: "flex",
        gap: 10,
        alignItems: "center",
        marginBottom: 8,
    },
    pagination: {
        marginTop: 20,
        display: "flex",
        gap: 10,
        alignItems: "center",
    },
    error: { color: "red" },
};
