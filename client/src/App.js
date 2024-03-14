import './App.css';
import PostCreate from './PostCreate';
import PostList from './PostList';

function App() {
  return (
    <div className="App">
      <h1> LET's Create A Post </h1>
      <PostCreate />
      <h1>Posts</h1>
      <PostList />
    </div>
  );
}

export default App;