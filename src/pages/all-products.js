import React from 'react';
import { Layout, Filters, ProductsGrid, SEO } from 'components';
import ProductContext from 'context/ProductContext';
import styled from 'styled-components';
import queryString from 'query-string';
import { useLocation } from '@reach/router';

const Content = styled.div`
  display: grid;
  grid-gap: 20px;
  margin-top: 20px;
  grid-template-columns: 1fr 3fr;
`;

export default function AllProducts() {
  const { products, collections } = React.useContext(ProductContext);
  const collectionProductMap = {};
  const { search } = useLocation();
  const qs = queryString.parse(search);
  const selectedCollectionIds = qs.c?.split(',').filter(c => !!c) || [];
  const selectedCollectionIdsMap = {};
  const searchTerm = qs.s;

  selectedCollectionIds.forEach(collectionId => {
    selectedCollectionIdsMap[collectionId] = true;
  });

  if (collections) {
    collections.forEach(collection => {
      collectionProductMap[collection.shopifyId] = {};

      collection.products.forEach(product => {
        collectionProductMap[collection.shopifyId][product.shopifyId] = true;
      });
    });
  }

  console.log(collectionProductMap);
  const filterByCategory = product => {
    if (Object.keys(selectedCollectionIdsMap).length) {
      for (let key in selectedCollectionIdsMap) {
        if (collectionProductMap[key]?.[product.shopifyId]) {
          return true;
        }
      }
      return false;
    }
    return true;
  };

  const filterBySearchTerm = product => {
    if (searchTerm) {
      return (
        product.title.toLowerCase().indexOf(searchTerm.toLocaleLowerCase()) >= 0
      );
    }
    return true;
  };
  const filteredProducts = products
    .filter(filterByCategory)
    .filter(filterBySearchTerm);

  return (
    <Layout>
      <SEO title="All products" />
      {!!searchTerm && !!filteredProducts.length && (
        <h3>
          Search term: <strong>'{searchTerm}'</strong>
        </h3>
      )}
      <h1>All products</h1>
      {!!filteredProducts.length && <h4>{filteredProducts.length} products</h4>}
      <Content>
        <Filters />
        {!filteredProducts.length && (
          <div>
            <h3>
              <span>Oh no! Nothing matches</span>
              &nbsp;
              <strong>'{searchTerm}'</strong>
            </h3>
            <div>
              To help with your search why not try:
              <br />
              <br />
              <ul>
                <li>Checking Your spelling</li>
                <li>Using less words</li>
                <li>Try using different search term</li>
              </ul>
            </div>
          </div>
        )}
        {!!filteredProducts && (
          <div>
            <ProductsGrid products={filteredProducts} />
          </div>
        )}
      </Content>
    </Layout>
  );
}
