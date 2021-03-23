import { gql } from '@apollo/client'

export const ADD_PO = gql`
  mutation createPO ($input: CreatePurchasingOrderInput, $access_token: String!){
    createPurchasingOrder(input: $input, access_token: $access_token) {
      vendorName,
      status,
      items {
        name
        quantity
      }
      createdAt,
      updatedAt,
      expiredDate
    }
  }

`;

export const GET_PO =gql`
query getPO{
  purchasingOrders {
    _id,
    vendorName,
    items {
      name,
      quantity,
      currentQuantity
    }
    status,
    createdAt
  }
}
`;

export const GET_DETAIL_PO = gql`
  query getPObyId($id: ID!){
    purchasingOrderById(id: $id){
      _id
      vendorName
      items{
        name
        quantity
        currentQuantity
      }
      status
      createdAt
      updatedAt
      expiredDate
    }
  }

`;

export const CREATE_BROADCAST_CHECKER = gql`
  mutation createBroadCastAdminForChecker($idPO: ID!, $access_token: String!){
    createBroadcastChecker(idPurchasingOrder: $idPO, access_token: $access_token) {
      _id
      purchasingOrder{
        _id
        vendorName
        items{
          name
                quantity
                currentQuantity
        }
        status
        createdAt
        updatedAt
        expiredDate
      }
        role
        checkerId
    }
  }
`;

export const GET_BROADCASTS_CHECKER = gql`
  query broadcastForCheckers($access_token: String!){
  broadcastChecker(access_token: $access_token) {
    broadcasts {
      _id
      purchasingOrder {
        _id
        vendorName
        items{
          name
          quantity
          currentQuantity
        }
        status
        createdAt
        updatedAt
        expiredDate
      }
      role
      checkerId
    }
      unfinishedBroadcast {
        _id
        purchasingOrder {
          _id
          vendorName
          items {
            name
            quantity
            currentQuantity
          }
          status
          createdAt
          updatedAt
          expiredDate
        }
        role
        checkerId
      }
    }
  }

`;

export const GET_BROADCAST_CHECKER_BY_ID = gql`
  query broadcastCheckerById($idBroadcast: ID!, $access_token: String!) {
    broadcastCheckerById(id: $idBroadcast ,access_token: $access_token) {
      _id
      purchasingOrder {
        _id
        status,
        items {
          name,
          quantity,
          currentQuantity
        }
      },
      role,
      checkerId
    }
  }
`;

export const SUBMIT_CHECKER = gql`
  mutation checkerClickDone ($input: [ItemInputUpdate]!, $access_token: String!, $idPO: String!, $idBroadcast: String!) {
    checkerUpdateItem(items: $input, access_token: $access_token, idPO: $idPO, idBroadCast: $idBroadcast)
  }
`;

export const GET_REQUESTS = gql`
  query findAllRequest{
    requests{
      _id
      storeName
      items{
        itemId
        itemName
        quantityRequest
      }
      createdAt
      updatedAt
      status
    }
  }
`;

export const GET_REQUEST_DETAIL = gql`
  query findRequestById($id: ID!){
    requestById(id: $id){
      _id
      storeName
      items{
        itemId
        itemName
        quantityRequest
        storageQuantity
      }
      createdAt
      updatedAt
      status
    }
  }
`;

export const GET_REQUEST_WITH_PO = gql`
  query getRequestWithPO($id: ID!, $access_token: String!) {
    requestsWithPO(idStoreReq: $id, access_token: $access_token) {
      request {
        _id
        storeName
        items {
          itemName
          quantityRequest
        }
      }
      dropdown {
        name
        PO {
          _id
          current_quantity
        }
      }
    }
  }
`;