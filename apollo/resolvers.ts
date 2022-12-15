import _ from "lodash";
import { nanoid } from "nanoid";

let todos = [
  {
    id: nanoid(),
    desc: "Add another component to Tailwind Components",
    isDone: false,
  },
  {
    id: nanoid(),
    desc: "Submit Todo App Component to Tailwind Components",
    isDone: true,
  },
];

export const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    addTodo: (__, { desc }) => {
      const todo = { id: nanoid(), desc, isDone: false };
      todos = [...todos, todo];
      return todo;
    },
    setTodoDone: (__, { id, isDone }) => {
      let todo = _.find(todos, { id });
      todo.isDone = isDone;
      return todo;
    },
    removeTodo: (__, { id }) => {
      const result = _.remove(todos, { id });
      return _.isEmpty(result);
    },
  },
};
