import { gql } from '@apollo/client'

export const typeDefs = gql`
  type Todo {
    id: ID!
    desc: String!
    isDone: Boolean!
  }

  type Query {
    todos: [Todo]
  }

  type Mutation {
    addTodo(desc: String): Todo 
    setTodoDone(id: ID!, isDone: Boolean): Todo
    removeTodo(id: ID): Boolean
  }
`
