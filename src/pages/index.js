import Carousel from 'react-bootstrap/Carousel'
import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Card, Col, Container, Row, Spinner } from 'react-bootstrap';
import { getRating, getRequest, useDrag, price } from '../utils/Function';
import { ScrollMenu, VisibilityContext } from 'react-horizontal-scrolling-menu';

export default function Home() {
  const [banner, setBanner] = useState([])
  const [category, setCategory] = useState([])
  const [product, setProduct] = useState([])
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const { dragStart, dragStop, dragMove, dragging } = useDrag();

  async function getBanner() {
    let { data } = await getRequest('utility/home/banner-web')
    setBanner(data.data)
  }

  async function getCategory() {
    let { data } = await getRequest('utility/home/box-category?with_staple=true')
    setCategory(data.data)
  }

  async function getProduct() {
    if (page <= lastPage) {
      setIsLoading(true)
      let { data } = await getRequest(`product-recommendation?page=${page}`)
      console.log(data.meta.index)
      setProduct([...product, ...data.data])
      setLastPage(data.meta.total_page)
      setIsLoading(false)
    }
  }

  const handleDrag = ({ scrollContainer }) => (ev) =>
    dragMove(ev, (posDiff) => {
      if (scrollContainer.current) {
        scrollContainer.current.scrollLeft += posDiff;
      }
    });

  const isScrolling = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    setPage((v) => v + 1)
  };

  useEffect(() => {
    getBanner()
    getCategory()
    window.addEventListener("scroll", isScrolling);
    return () => window.removeEventListener("scroll", isScrolling);
  }, []);

  useEffect(() => {
    getProduct()
  }, [page])

  return (
    <div>
      <Carousel>
        {banner.map((item, index) => (
          <Carousel.Item key={index}>
            <img
              className="d-block w-100"
              src={item.url_mobile}
              alt="slide"
            />
          </Carousel.Item>
        )
        )}
      </Carousel>
      <Container className='mt-5 mb-5'>
        <div onMouseLeave={dragStop}>
          <ScrollMenu
            onMouseDown={() => dragStart}
            onMouseUp={() => dragStop}
            onMouseMove={handleDrag}
          >
            {category.map((item, index) => (
              <button key={index} className="btn btn-light m-1 category rounded-1">
                <Col>
                  <img src={item.icon} />
                  <p className='text-muted text-wrap'>{item.category_name}</p>
                </Col>
              </button>
            ))}
          </ScrollMenu>
        </div>

        <Row xs={2} md={3} lg={5} className="g-4 mt-3 mb-3">
          {product.map((item, index) => (
            <Col key={index}>
              <Card>
                <Card.Img variant="top" src={item.image_uri} />
                <Card.Body>
                  {getRating(item.product_score_review, item.product_total_review)}
                  <small className='max-2 mt-2 mb-1 text-muted'>{item.supplier_name}</small>
                  <Card.Title className='text-capitalize max-2'>{item.product_name}</Card.Title>
                  <h5 className='text-danger fw-bold'>{price(item.normal_price)}</h5>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        {isLoading && <div className='text-center mt-2'><Spinner animation="border" /></div>}
      </Container>
    </div>
  )
}