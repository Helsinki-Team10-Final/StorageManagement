import { gql } from '@apollo/client'

export const GET_WISHLIST = gql`
  query getWishlist {
    watchlistVar @client
  }
`

export const GET_ALL_dATA = gql`
  query getEntertainMe {
    entertainMe {
      movies {
        _id,
        title,
        overview,
        poster_path,
        popularity,
        tags
      }
      tv {
        _id,
        title,
        overview,
        poster_path,
        popularity,
        tags
      }
    }
  }
`;

export const GET_MOVIES = gql`
  query FetchMovies{
    movies {
      _id,
      title,
      overview,
      poster_path,
      popularity,
      tags
    }
  }
`;

export const GET_SERIES = gql`
  query FetchSeries{
    series {
      _id,
      title,
      overview,
      poster_path,
      popularity,
      tags
    }
  }
`;

export const GET_MOVIE = gql`
  query getMovie ($id: ID!) {
    movie(id: $id) {
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`;

export const GET_SERIE = gql`
  query getSerie ($id: ID!) {
    serie(id: $id) {
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`;
export const DELETE_MOVIE = gql`
  mutation delete ($id: ID!) {
    deleteMovie(id: $id) {
      message
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation update($id: ID!, $movie: MovieInput) {
    updateMovie(id: $id ,movie: $movie) {
      _id,
      title,
      overview,
      poster_path,
      popularity,
      tags
    }
  }
`;

export const ADD_MOVIE = gql`
  mutation addMovie($movie: MovieInput ) {
    addMovie (movie: $movie) {
      _id
      title
      overview
      poster_path
      popularity
      tags
    }
  }
`;

export const GET_PO = gql`
  query getPO {
    purchasingOrders {
      _id
      vendorName
      items {
        name
        quantity
        currentQuantity
      }
      status
      createdAt
      expiredDate
    }
  }
`;