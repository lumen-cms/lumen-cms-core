/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import type * as Types from './hasura-types';

import { GraphQLClient, type RequestOptions } from 'graphql-request';
import gql from 'graphql-tag';
type GraphQLClientRequestHeaders = RequestOptions['requestHeaders'];
export type AllCategoriesQueryVariables = Exact<{
  travelFilter: Types.Travel_Bool_Exp;
}>;


export type AllCategoriesQuery = { travel_type: Array<{ id: number, title: string, title_de: string, mn_travel_travel_types_aggregate: { aggregate: { count: number | null } | null } }>, city: Array<{ id: number, title: string, title_de: string, travels_aggregate: { aggregate: { count: number | null } | null } }>, country: Array<{ id: number, title: string, title_de: string, cities: Array<{ travels_aggregate: { aggregate: { count: number | null } | null } }> }>, branch: Array<{ id: number, title: string, title_de: string, mn_travel_branches_aggregate: { aggregate: { count: number | null } | null } }> };

export type AllTravelsQueryVariables = Exact<{
  locale: Types.Enum_Language_Enum;
}>;


export type AllTravelsQuery = { travel: Array<{ id: number, title: string, updated_at: any, slug: string, teaser_text: string | null, language_key: Types.Enum_Language_Enum | null, city_id: number | null, fileStoryblokByPreviewImageId: { id: number, url: string | null, url_new: string | null } | null, product: { id: number, title: string, title_de: string | null, duration: number | null, duration_days: number | null, product_price: { aus: any, eur: any, gbp: any, usd: any, id: number } | null } | null, city: { id: number, title: string, title_de: string, country_id: number | null, country: { id: number, title: string, title_de: string } | null } | null, mn_travel_branches: Array<{ branch_id: number, branch: { title: string, title_de: string } }>, mn_travel_travel_types: Array<{ travel_type_id: number, travel_type: { title: string, title_de: string } }> }> };

export type TravelBySlugQueryVariables = Exact<{
  slug: string;
}>;


export type TravelBySlugQuery = { travel: Array<{ id: number, title: string, meta_description: string | null, page_title: string | null, description: string | null, slug: string, overview: string | null, travel_service: { id: number, description: string | null } | null, travel_itinerary: { id: number, description: string | null } | null, travel_accommodation: { id: number, description: string | null } | null, travel_team: { id: number, description: string | null, file_storyblok: { id: number, url: string | null, url_new: string | null } | null } | null, travel_fast_fact: { id: number, title: string, accommodation: number | null, airport_transport: number | null, duration: string | null, education: string | null, language_skill: number | null, meal: number | null, payment: number | null, minimum_age: number | null } | null, fileStoryblokByHeaderImageId: { id: number, url: string | null, url_new: string | null } | null, file_storybloks: Array<{ id: number, url: string | null, url_new: string | null }>, product: { id: number, title: string, title_de: string | null, duration: number | null, duration_days: number | null, product_price: { aus: any, eur: any, gbp: any, usd: any, id: number } | null } | null, city: { title: string, title_de: string, country: { title: string, title_de: string } | null } | null, mn_travel_branches: Array<{ branch: { title: string, title_de: string } }>, mn_travel_travel_types: Array<{ travel_type: { title: string, title_de: string } }> }> };


export const AllCategoriesDocument = gql`
    query allCategories($travelFilter: travel_bool_exp!) {
  travel_type(where: {mn_travel_travel_types: {travel: $travelFilter}}) {
    id
    title
    title_de
    mn_travel_travel_types_aggregate(where: {travel: $travelFilter}) {
      aggregate {
        count
      }
    }
  }
  city(where: {travels: $travelFilter}) {
    id
    title
    title_de
    travels_aggregate(where: $travelFilter) {
      aggregate {
        count
      }
    }
  }
  country(where: {cities: {travels: $travelFilter}}) {
    id
    title
    title_de
    cities {
      travels_aggregate(where: $travelFilter) {
        aggregate {
          count
        }
      }
    }
  }
  branch(where: {mn_travel_branches: {travel: $travelFilter}}) {
    id
    title
    title_de
    mn_travel_branches_aggregate(where: {travel: $travelFilter}) {
      aggregate {
        count
      }
    }
  }
}
    `;
export const AllTravelsDocument = gql`
    query allTravels($locale: enum_language_enum!) {
  travel(
    order_by: {updated_at: desc_nulls_last, id: desc, title: asc}
    where: {language_key: {_eq: $locale}, slug: {_neq: ""}, published: {_eq: true}, title: {_neq: ""}, product_id: {_gte: 1}, preview_image_id: {_gte: 1}}
  ) {
    id
    title
    updated_at
    slug
    teaser_text
    language_key
    fileStoryblokByPreviewImageId {
      id
      url
      url_new
    }
    product {
      id
      title
      title_de
      duration
      duration_days
      product_price {
        aus
        eur
        gbp
        usd
        id
      }
    }
    city_id
    city {
      id
      title
      title_de
      country_id
      country {
        id
        title
        title_de
      }
    }
    mn_travel_branches {
      branch_id
      branch {
        title
        title_de
      }
    }
    mn_travel_travel_types {
      travel_type_id
      travel_type {
        title
        title_de
      }
    }
  }
}
    `;
export const TravelBySlugDocument = gql`
    query travelBySlug($slug: String!) {
  travel(where: {slug: {_eq: $slug}}) {
    id
    title
    meta_description
    page_title
    description
    slug
    overview
    travel_service {
      id
      description
    }
    travel_itinerary {
      id
      description
    }
    travel_accommodation {
      id
      description
    }
    travel_team {
      id
      description
      file_storyblok {
        id
        url
        url_new
      }
    }
    travel_fast_fact {
      id
      title
      accommodation
      airport_transport
      duration
      education
      language_skill
      meal
      payment
      minimum_age
    }
    fileStoryblokByHeaderImageId {
      id
      url
      url_new
    }
    file_storybloks {
      id
      url
      url_new
    }
    product {
      id
      title
      title_de
      duration
      duration_days
      product_price {
        aus
        eur
        gbp
        usd
        id
      }
    }
    city {
      title
      title_de
      country {
        title
        title_de
      }
    }
    mn_travel_branches {
      branch {
        title
        title_de
      }
    }
    mn_travel_travel_types {
      travel_type {
        title
        title_de
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string, variables?: any) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType, _variables) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    allCategories(variables: AllCategoriesQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllCategoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllCategoriesQuery>({ document: AllCategoriesDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'allCategories', 'query', variables);
    },
    allTravels(variables: AllTravelsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<AllTravelsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AllTravelsQuery>({ document: AllTravelsDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'allTravels', 'query', variables);
    },
    travelBySlug(variables: TravelBySlugQueryVariables, requestHeaders?: GraphQLClientRequestHeaders, signal?: RequestInit['signal']): Promise<TravelBySlugQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<TravelBySlugQuery>({ document: TravelBySlugDocument, variables, requestHeaders: { ...requestHeaders, ...wrappedRequestHeaders }, signal }), 'travelBySlug', 'query', variables);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;