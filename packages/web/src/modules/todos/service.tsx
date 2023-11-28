import { FC, ReactNode, createContext, useContext } from "react";
import axios from "axios";
import { IGroup, ITodo } from "models/todos";

import { AuthResult } from "models/auth";

export interface TodoUrls {
  todos: string;
  groups: string;
}

export class TodoService {
  constructor(private auth: AuthResult, private urls: TodoUrls) {}
  getTodos() {
    return axios
      .get<ITodo[]>(this.urls.todos, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  getTodo(id: number) {
    return axios
      .get<ITodo[]>(`${this.urls.todos}/${id}`, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  createTodo(todo: Partial<ITodo>) {
    return axios
      .post<ITodo>(`${this.urls.todos}`, todo, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  updateTodo(id: number, todo: Partial<ITodo>) {
    return axios
      .put<ITodo>(`${this.urls.todos}/${id}`, todo, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  deleteTodo(id: number) {
    return axios
      .delete(`${this.urls.todos}/${id}`, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  getGroups() {
    return axios
      .get<IGroup[]>(this.urls.groups, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  getGroup(id: number) {
    return axios
      .get<IGroup[]>(`${this.urls.groups}/${id}`, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  createGroup(group: { title: string }) {
    return axios
      .post<IGroup>(`${this.urls.groups}`, group, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  updateGroup(id: number, group: IGroup) {
    return axios
      .put<IGroup>(`${this.urls.groups}/${id}`, group, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }

  deleteGroup(id: number) {
    return axios
      .delete(`${this.urls.groups}/${id}`, {
        headers: { Authorization: this.auth.token },
      })
      .then((res) => res.data);
  }
}

const TodoContext = createContext<TodoService | undefined>(undefined);

export const createTodoServiceProvider: (
  auth: AuthResult,
  urls: TodoUrls
) => FC<{ children: ReactNode }> =
  (auth, urls) =>
  ({ children }) => {
    const service = new TodoService(auth, urls);
    return (
      <TodoContext.Provider value={service}>{children}</TodoContext.Provider>
    );
  };

export const useTodoService = () => useContext(TodoContext);
