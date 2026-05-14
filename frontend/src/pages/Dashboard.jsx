function Dashboard({ user }) {
  return (
    <div style={{ padding: 20 }}>
      <h1>Welcome {user.name} 👋</h1>

      <p>Email: {user.email}</p>

      <button>Post Skill</button>
      <button>Search Skills</button>
      <button>Logout</button>
    </div>
  );
}

export default Dashboard;