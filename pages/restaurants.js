/* /pages/restaurants.js */
import { useContext } from "react";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { gql } from "apollo-boost";


import Cart from "../components/cart/";
import AppContext from "../context/AppContext";


import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Col,
  Row,
} from "reactstrap";

const GET_RESTAURANT_PRODUCTS = gql`
  query($id: ID!) {
    restaurant(id: $id) {
      id
      name
      category
      {
        name
        categories
        {
          name
          product
          {
            id
            name
            description
            price
            image {
              url
            }
          }
          subcategories {
            name 
            product {
              id
              name
              description
              price
              image {
                url
              }
            }
          }
        }
      }
    }
  }
`;

function Restaurants() {
  const appContext = useContext(AppContext);
  const router = useRouter();
  const { loading, error, data } = useQuery(GET_RESTAURANT_PRODUCTS, {
    variables: { id: router.query.id },
  });

  if (error) return error;
  if (loading) return <h1>Loading ...</h1>;
  if (data.restaurant) {
    const { restaurant } = data;
    return (
      <>
        <br></br>
        <h1>{
          restaurant.name 
          }
        </h1>
        <br></br>
        <Row>
          {
            restaurant.category.categories.map((res) => 
              <div className="row">
              <div className="col-12">
                <h1>{res.name}</h1>
              </div>
              {
              res.product.map((res) => (
                <Col xs="6" sm="4" style={{ padding: 0 }} key={res.id}>
                  <Card style={{ margin: "0 10px" }}>
                    <CardImg
                      top={true}
                      style={{ height: 250 }}
                      src={`${process.env.NEXT_PUBLIC_API_URL}${res.image[0].url}`}
                    />
                    <CardBody>
                      <CardTitle><h4>{res.name}</h4></CardTitle>
                      <CardText>{res.description}</CardText>
                      <CardText><h4>{res.price}$</h4></CardText>
                    </CardBody>
                    <div className="card-footer">
                    <Button
                        outline
                        color="primary"
                        onClick={() => appContext.addItem(res)}
                      >
                        + Add To Cart
                      </Button>

                      <style jsx>
                        {`
                          a {
                            color: white;
                          }
                          a:link {
                            text-decoration: none;
                            color: white;
                          }
                          .container-fluid {
                            margin-bottom: 30px;
                          }
                          .btn-outline-primary {
                            color: #007bff !important;
                          }
                          a:hover {
                            color: white !important;
                          }
                        `}
                      </style>
                    </div>
                  </Card>
                </Col>
              ))}
            </div>
                     )}
          <Col xs="3" style={{ padding: 0 }}>
            <div>
              <Cart />
            </div>
          </Col>
        </Row>
      </>
    );
  }
  return <h1>Add Dishes</h1>;
}
export default Restaurants;