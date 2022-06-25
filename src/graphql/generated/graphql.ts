import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql'
export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] }
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> }
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  Date: any
  DateTime: any
  EmailAddress: any
  JWT: any
  LastValue: any
  Latitude: any
  Longitude: any
  NonEmptyString: any
  NonNegativeInt: any
  PositiveInt: any
  URL: any
  UUID: any
}

export type Mutation = {
  __typename?: 'Mutation'
  /** 로그아웃 성공 여부 반환 */
  logout: Scalars['Boolean']
  /** 회원탈퇴 시 사용자 정보가 모두 초기화됩니다 */
  unregister?: Maybe<User>
  /** 사용자 정보를 수정합니다 */
  updateUser?: Maybe<User>
}

export type MutationUpdateUserArgs = {
  input: UserModificationInput
}

/** 기본값: 내림차순 */
export enum OrderDirection {
  Asc = 'ASC',
}

export type Pagination = {
  lastId?: InputMaybe<Scalars['ID']>
  lastValue?: InputMaybe<Scalars['LastValue']>
  limit: Scalars['PositiveInt']
}

export type Query = {
  __typename?: 'Query'
  /** 사용자 닉네임 중복 여부 검사 */
  isNicknameUnique: Scalars['Boolean']
  /** 현재 로그인된(JWT) 사용자 정보를 반환 */
  me?: Maybe<User>
  /** 닉네임으로 사용자 검색 */
  userByNickname?: Maybe<User>
}

export type QueryIsNicknameUniqueArgs = {
  nickname: Scalars['NonEmptyString']
}

export type QueryUserByNicknameArgs = {
  nickname: Scalars['NonEmptyString']
}

export enum Sex {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
  Unknown = 'UNKNOWN',
}

export type User = {
  __typename?: 'User'
  bio?: Maybe<Scalars['String']>
  birthyear?: Maybe<Scalars['Int']>
  creationTime: Scalars['DateTime']
  id: Scalars['UUID']
  imageUrl?: Maybe<Scalars['URL']>
  nickname?: Maybe<Scalars['String']>
  sex: Sex
}

export type UserModificationInput = {
  ageRange?: InputMaybe<Scalars['NonEmptyString']>
  bio?: InputMaybe<Scalars['String']>
  birthday?: InputMaybe<Scalars['NonEmptyString']>
  email?: InputMaybe<Scalars['EmailAddress']>
  imageUrl?: InputMaybe<Scalars['URL']>
  nickname?: InputMaybe<Scalars['NonEmptyString']>
  phoneNumber?: InputMaybe<Scalars['NonEmptyString']>
  sex?: InputMaybe<Sex>
}

export type WithIndex<TObject> = TObject & Record<string, any>
export type ResolversObject<TObject> = WithIndex<TObject>

export type ResolverTypeWrapper<T> = Promise<T> | T

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Date: ResolverTypeWrapper<Scalars['Date']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>
  ID: ResolverTypeWrapper<Scalars['ID']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  JWT: ResolverTypeWrapper<Scalars['JWT']>
  LastValue: ResolverTypeWrapper<Scalars['LastValue']>
  Latitude: ResolverTypeWrapper<Scalars['Latitude']>
  Longitude: ResolverTypeWrapper<Scalars['Longitude']>
  Mutation: ResolverTypeWrapper<{}>
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']>
  OrderDirection: OrderDirection
  Pagination: Pagination
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>
  Query: ResolverTypeWrapper<{}>
  Sex: Sex
  String: ResolverTypeWrapper<Scalars['String']>
  URL: ResolverTypeWrapper<Scalars['URL']>
  UUID: ResolverTypeWrapper<Scalars['UUID']>
  User: ResolverTypeWrapper<User>
  UserModificationInput: UserModificationInput
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']
  Date: Scalars['Date']
  DateTime: Scalars['DateTime']
  EmailAddress: Scalars['EmailAddress']
  ID: Scalars['ID']
  Int: Scalars['Int']
  JWT: Scalars['JWT']
  LastValue: Scalars['LastValue']
  Latitude: Scalars['Latitude']
  Longitude: Scalars['Longitude']
  Mutation: {}
  NonEmptyString: Scalars['NonEmptyString']
  NonNegativeInt: Scalars['NonNegativeInt']
  Pagination: Pagination
  PositiveInt: Scalars['PositiveInt']
  Query: {}
  String: Scalars['String']
  URL: Scalars['URL']
  UUID: Scalars['UUID']
  User: User
  UserModificationInput: UserModificationInput
}>

export interface DateScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Date'], any> {
  name: 'Date'
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime'
}

export interface EmailAddressScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['EmailAddress'], any> {
  name: 'EmailAddress'
}

export interface JwtScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['JWT'], any> {
  name: 'JWT'
}

export interface LastValueScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['LastValue'], any> {
  name: 'LastValue'
}

export interface LatitudeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Latitude'], any> {
  name: 'Latitude'
}

export interface LongitudeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Longitude'], any> {
  name: 'Longitude'
}

export type MutationResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']
> = ResolversObject<{
  logout?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  unregister?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updateUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'input'>
  >
}>

export interface NonEmptyStringScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['NonEmptyString'], any> {
  name: 'NonEmptyString'
}

export interface NonNegativeIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['NonNegativeInt'], any> {
  name: 'NonNegativeInt'
}

export interface PositiveIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['PositiveInt'], any> {
  name: 'PositiveInt'
}

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  isNicknameUnique?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryIsNicknameUniqueArgs, 'nickname'>
  >
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  userByNickname?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserByNicknameArgs, 'nickname'>
  >
}>

export interface UrlScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['URL'], any> {
  name: 'URL'
}

export interface UuidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['UUID'], any> {
  name: 'UUID'
}

export type UserResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']
> = ResolversObject<{
  bio?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  birthyear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>
  imageUrl?: Resolver<Maybe<ResolversTypes['URL']>, ParentType, ContextType>
  nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  sex?: Resolver<ResolversTypes['Sex'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = any> = ResolversObject<{
  Date?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  EmailAddress?: GraphQLScalarType
  JWT?: GraphQLScalarType
  LastValue?: GraphQLScalarType
  Latitude?: GraphQLScalarType
  Longitude?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  NonEmptyString?: GraphQLScalarType
  NonNegativeInt?: GraphQLScalarType
  PositiveInt?: GraphQLScalarType
  Query?: QueryResolvers<ContextType>
  URL?: GraphQLScalarType
  UUID?: GraphQLScalarType
  User?: UserResolvers<ContextType>
}>
