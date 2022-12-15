import gql from "graphql-tag";
import cn from "classnames";
import Link from "next/link";
import { useEffect } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useImmer } from "use-immer";
import { initializeApollo } from "../apollo/client";

const TODOS = gql`
  query Query {
    todos {
      id
      desc
      isDone
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($desc: String!) {
    addTodo(desc: $desc) {
      id
    }
  }
`;

const SET_TODO_DONE = gql`
  mutation SetTodoDone($id: ID!, $isDone: Boolean) {
    setTodoDone(id: $id, isDone: $isDone) {
      id
    }
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: ID!) {
    removeTodo(id: $id)
  }
`;

const Index = () => {
  const [state, setState] = useImmer({
    newTodo: {
      desc: "",
    },
  });

  const {
    data: { todos },
  } = useQuery(TODOS, { fetchPolicy: "cache-and-network" });

  const [addTodo] = useMutation(ADD_TODO, {
    variables: { desc: state.newTodo.desc },
    refetchQueries: [{ query: TODOS, fetchPolicy: "network-only" }],
  });

  const [setTodoDone] = useMutation(SET_TODO_DONE, {
    refetchQueries: [{ query: TODOS, fetchPolicy: "network-only" }],
  });

  const [removeTodo] = useMutation(REMOVE_TODO, {
    refetchQueries: [{ query: TODOS, fetchPolicy: "network-only" }],
  });

  useEffect(() => {
    console.log("todos :>> ", todos);
  }, [todos]);

  return (
    <div className="h-screen w-full flex items-center justify-center bg-teal-lightest font-sans">
      <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-1/2">
        <div className="mb-4">
          <h1 className="text-grey-darkest">Todo List</h1>
          <div className="flex mt-4">
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
              placeholder="Add Todo"
              value={state.newTodo.desc}
              onChange={(e) => {
                setState((state) => {
                  state.newTodo.desc = e.target.value;
                });
              }}
            />
            <button
              className="flex p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal-600"
              onClick={() => addTodo()}
            >
              Add
            </button>
          </div>
        </div>
        <div>
          {todos.map((todo) => (
            <div className="flex mb-4 items-center" key={todo.id}>
              <p
                className={cn(
                  "w-full text-grey-darkest",
                  todo.isDone && "line-through text-green-600"
                )}
              >
                {todo.desc}
              </p>
              {todo.isDone ? (
                <button
                  className="flex p-2 whitespace-nowrap ml-4 mr-2 border-2 rounded hover:text-white text-gray-600 border-gray-600 hover:bg-gray-600"
                  onClick={() => {
                    setTodoDone({ variables: { id: todo.id, isDone: false } });
                  }}
                >
                  Not Done
                </button>
              ) : (
                <button
                  className="flex p-2 whitespace-nowrap ml-4 mr-2 border-2 rounded hover:text-white text-green-600 border-green-600 hover:bg-green-600"
                  onClick={() => {
                    setTodoDone({ variables: { id: todo.id, isDone: true } });
                  }}
                >
                  Done
                </button>
              )}
              <button
                className="flex p-2 whitespace-nowrap ml-2 border-2 rounded text-red-600 border-red-600 hover:text-white hover:bg-red-600"
                onClick={() => {
                  removeTodo({ variables: { id: todo.id } });
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export async function getStaticProps() {
  const apolloClient = initializeApollo();

  await apolloClient.query({
    query: TODOS,
  });

  return {
    props: {
      initialApolloState: apolloClient.cache.extract(),
    },
  };
}

export default Index;

{
  /* <div className="text-3xl font-bold underline">
You're signed in as {viewer.name} and you're {viewer.status} goto{" "}
<Link href="/about">static</Link> page.
</div> */
}
