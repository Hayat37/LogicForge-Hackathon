import { useEffect } from "react";

function App() {

  useEffect(() => {
    fetch("http://localhost:8000/test.php")
      .then(res => res.text())
      .then(data => console.log(data));
  }, []);

  return (
    <div>
      <h1>SkillSwap</h1>
    </div>
  );
}

export default App;