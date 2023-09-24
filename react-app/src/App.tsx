import { useEffect, useRef, useState, FormEvent } from "react";
import axios from "axios";

interface Todo {
  todo: string;
  description: string;
  todoId: string;
  completed: boolean;
}

function App() {
  const [data, setData] = useState<any>([]);
  let url: any = process.env.REACT_APP_URL;

  useEffect(() => {
    // fetch(url, {
    //   method: "GET",
    // })
    //   .then((res) => res.json())
    //   .then((json) => setData(json));
    axios.get(url).then((response) => setData(response.data));
  }, []);

  //For Deleting the item

  function deleteItem(item: Todo): void {
    const originalData = [...data];
    setData(data.filter((i: Todo) => i.todoId !== item.todoId));
    // fetch(`http://localhost:5000/api/v1/todos/${item.todoId}`, {
    //   method: "DELETE",
    // });
    axios
      .delete(`${url}${item.todoId}`)
      .then((res) => console.log(res))
      .catch((err) => {
        setData(originalData);
      });
  }

  const todoRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const todo = { todo: "", description: "" };

    if (todoRef.current != null) {
      todo.todo = todoRef.current.value;
    }

    if (descRef.current != null) {
      todo.description = descRef.current.value;
    }
    setData([todo, ...data]);
    axios.post(url, todo).then((res) => setData([res.data, ...data]));
  };

  //For updating the status

  const status = (item: Todo) => {
    const updatedItem = {
      ...item,
      completed: !item.completed,
    };
    setData(
      data.map((i: Todo) => (i.todoId === item.todoId ? updatedItem : i))
    );
    axios.put(`${url}${item.todoId}`, updatedItem);
  };

  return (
    <div className="container-lg">
      <div className="wd-50">
        <div>
          <form action="POST" className="mb-3" onSubmit={handleSubmit}>
            <label htmlFor="todo">Todo</label>
            <input
              id="todo"
              type="text"
              className="form-control"
              ref={todoRef}
            />
            <label htmlFor="desc" className="mt-3">
              Description
            </label>
            <input
              id="desc"
              type="text"
              className="form-control"
              ref={descRef}
            />
            <button type="submit" className="btn btn-primary mt-3">
              Add
            </button>
          </form>
        </div>
        <div>
          <ul className="list-group">
            {data.map((item: Todo) => (
              <li
                key={item.todoId}
                className="list-group-item d-flex justify-content-between"
              >
                {`${item.todo}: ${item.description}`}
                <div>
                  <button
                    className="btn btn-outline-danger mx-2"
                    onClick={() => deleteItem(item)}
                  >
                    Delete
                  </button>
                  <button
                    className="btn btn-warning"
                    onClick={() => status(item)}
                  >{`Completed: ${item.completed ? true : false} `}</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
