import TopBar from "./components/top-bar";
import Board from "./components/board";
import EraserCursor from "./components/eraser-cursor";

function App() {
  return (
    <div className="flex flex-col h-screen bg-red-50">
      <EraserCursor />
      <TopBar />
      <div className="flex items-center justify-center flex-1 p-4 bg-muted/20">
        <Board />
      </div>
    </div>
  );
}

export default App;
