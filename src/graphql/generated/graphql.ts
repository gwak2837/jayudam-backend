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
  Any: any
  Date: any
  DateTime: any
  EmailAddress: any
  JWT: any
  Latitude: any
  Longitude: any
  NonEmptyString: any
  NonNegativeInt: any
  PositiveInt: any
  URL: any
  UUID: any
}

export type Certificate = {
  __typename?: 'Certificate'
  birthDate?: Maybe<Scalars['Date']>
  content?: Maybe<Scalars['String']>
  effectiveDate?: Maybe<Scalars['Date']>
  id: Scalars['ID']
  issueDate?: Maybe<Scalars['Date']>
  name?: Maybe<Scalars['NonEmptyString']>
  sex: Sex
}

export type CertificateAgreement = {
  __typename?: 'CertificateAgreement'
  immunizationSince?: Maybe<Scalars['Date']>
  sexualCrimeSince?: Maybe<Scalars['Date']>
  showBirthyear: Scalars['Boolean']
  showImmunizationDetails: Scalars['Boolean']
  showName: Scalars['Boolean']
  showSTDTestDetails: Scalars['Boolean']
  showSexualCrimeDetails: Scalars['Boolean']
  stdTestSince?: Maybe<Scalars['Date']>
}

export type CertificateAgreementInput = {
  immunizationSince?: InputMaybe<Scalars['Date']>
  sexualCrimeSince?: InputMaybe<Scalars['Date']>
  showBirthyear?: InputMaybe<Scalars['Boolean']>
  showImmunizationDetails?: InputMaybe<Scalars['Boolean']>
  showName?: InputMaybe<Scalars['Boolean']>
  showSTDTestDetails?: InputMaybe<Scalars['Boolean']>
  showSex?: InputMaybe<Scalars['Boolean']>
  showSexualCrimeDetails?: InputMaybe<Scalars['Boolean']>
  stdTestSince?: InputMaybe<Scalars['Date']>
}

export type CertificateCreationInput = {
  birthDate: Scalars['DateTime']
  issueDate: Scalars['DateTime']
  name: Scalars['NonEmptyString']
  sex: Sex
  verificationCode: Scalars['NonEmptyString']
}

export type Mutation = {
  __typename?: 'Mutation'
  connectToGoogleOAuth?: Maybe<Scalars['Boolean']>
  connectToKakaoOAuth?: Maybe<Scalars['Boolean']>
  connectToNaverOAuth?: Maybe<Scalars['Boolean']>
  createPost?: Maybe<Post>
  deletePost?: Maybe<Post>
  disconnectFromGoogleOAuth?: Maybe<Scalars['Boolean']>
  disconnectFromKakaoOAuth?: Maybe<Scalars['Boolean']>
  disconnectFromNaverOAuth?: Maybe<Scalars['Boolean']>
  logout?: Maybe<User>
  submitCertificateInfo?: Maybe<Scalars['Boolean']>
  takeAttendance?: Maybe<User>
  unregister?: Maybe<User>
  updatePost?: Maybe<Post>
  updateUser?: Maybe<User>
  verifyTown?: Maybe<User>
  wakeUser?: Maybe<User>
}

export type MutationCreatePostArgs = {
  input: PostCreationInput
}

export type MutationDeletePostArgs = {
  id: Scalars['ID']
}

export type MutationSubmitCertificateInfoArgs = {
  input: CertificateCreationInput
}

export type MutationUpdatePostArgs = {
  input: PostUpdateInput
}

export type MutationUpdateUserArgs = {
  input: UserUpdate
}

export type MutationVerifyTownArgs = {
  lat: Scalars['Latitude']
  lon: Scalars['Longitude']
}

/** 기본값: 내림차순 */
export enum OrderDirection {
  Asc = 'ASC',
}

export type Pagination = {
  lastId?: InputMaybe<Scalars['ID']>
  lastValue?: InputMaybe<Scalars['Any']>
  limit: Scalars['PositiveInt']
}

export type Post = {
  __typename?: 'Post'
  author?: Maybe<User>
  content?: Maybe<Scalars['NonEmptyString']>
  creationTime?: Maybe<Scalars['DateTime']>
  deletionTime?: Maybe<Scalars['DateTime']>
  id: Scalars['ID']
  imageUrls?: Maybe<Array<Maybe<Scalars['URL']>>>
  likeCount?: Maybe<Scalars['NonNegativeInt']>
  modificationTime?: Maybe<Scalars['DateTime']>
}

export type PostCreationInput = {
  content: Scalars['NonEmptyString']
  imageUrls?: InputMaybe<Array<Scalars['URL']>>
  parentPostId?: InputMaybe<Scalars['ID']>
}

export type PostUpdateInput = {
  content: Scalars['NonEmptyString']
  id: Scalars['ID']
  imageUrls?: InputMaybe<Array<Scalars['URL']>>
}

export type Query = {
  __typename?: 'Query'
  getCertificateJWT: Scalars['JWT']
  getMyCertificates?: Maybe<Array<Certificate>>
  isUniqueNickname: Scalars['Boolean']
  me?: Maybe<User>
  post?: Maybe<Post>
  posts?: Maybe<Array<Post>>
  userByNickname?: Maybe<User>
  verifyCertificateJWT?: Maybe<Certificate>
}

export type QueryGetCertificateJwtArgs = {
  input?: InputMaybe<CertificateAgreementInput>
}

export type QueryIsUniqueNicknameArgs = {
  nickname: Scalars['NonEmptyString']
}

export type QueryPostArgs = {
  id: Scalars['ID']
}

export type QueryUserByNicknameArgs = {
  nickname: Scalars['NonEmptyString']
}

export type QueryVerifyCertificateJwtArgs = {
  jwt: Scalars['JWT']
}

export type ServiceAgreement = {
  __typename?: 'ServiceAgreement'
  adAgreement?: Maybe<Scalars['Boolean']>
  adAgreementTime?: Maybe<Scalars['DateTime']>
  locationAgreement?: Maybe<Scalars['Boolean']>
  locationAgreementTime?: Maybe<Scalars['DateTime']>
  personalDataStoringYear?: Maybe<Scalars['NonNegativeInt']>
  privacyAgreement?: Maybe<Scalars['Boolean']>
  privacyAgreementTime?: Maybe<Scalars['DateTime']>
  termsAgreement?: Maybe<Scalars['Boolean']>
  termsAgreementTime?: Maybe<Scalars['DateTime']>
}

export type ServiceAgreementInput = {
  adAgreement?: InputMaybe<Scalars['Boolean']>
  locationAgreement?: InputMaybe<Scalars['Boolean']>
  personalDataStoringYear?: InputMaybe<Scalars['NonNegativeInt']>
  privacyAgreement?: InputMaybe<Scalars['Boolean']>
  termsAgreement?: InputMaybe<Scalars['Boolean']>
}

export enum Sex {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
  Unknown = 'UNKNOWN',
}

export type Town = {
  __typename?: 'Town'
  count: Scalars['NonNegativeInt']
  name: Scalars['NonEmptyString']
}

export type User = {
  __typename?: 'User'
  bio?: Maybe<Scalars['String']>
  birthyear?: Maybe<Scalars['Int']>
  blockingEndTime?: Maybe<Scalars['DateTime']>
  blockingStartTime?: Maybe<Scalars['DateTime']>
  certificateAgreement?: Maybe<CertificateAgreement>
  cherry: Scalars['NonNegativeInt']
  creationTime: Scalars['DateTime']
  email?: Maybe<Scalars['EmailAddress']>
  id: Scalars['UUID']
  imageUrls?: Maybe<Array<Scalars['URL']>>
  isVerifiedBirthday: Scalars['Boolean']
  isVerifiedBirthyear: Scalars['Boolean']
  isVerifiedEmail: Scalars['Boolean']
  isVerifiedName: Scalars['Boolean']
  isVerifiedPhoneNumber: Scalars['Boolean']
  isVerifiedSex: Scalars['Boolean']
  nickname?: Maybe<Scalars['String']>
  serviceAgreement?: Maybe<ServiceAgreement>
  sex: Sex
  towns?: Maybe<Array<Town>>
}

export type UserUpdate = {
  bio?: InputMaybe<Scalars['NonEmptyString']>
  certificateAgreement?: InputMaybe<CertificateAgreementInput>
  email?: InputMaybe<Scalars['EmailAddress']>
  imageUrls?: InputMaybe<Array<Scalars['URL']>>
  nickname?: InputMaybe<Scalars['NonEmptyString']>
  serviceAgreement?: InputMaybe<ServiceAgreementInput>
  town1Name?: InputMaybe<Scalars['NonEmptyString']>
  town2Name?: InputMaybe<Scalars['NonEmptyString']>
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
  Any: ResolverTypeWrapper<Scalars['Any']>
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>
  Certificate: ResolverTypeWrapper<Certificate>
  CertificateAgreement: ResolverTypeWrapper<CertificateAgreement>
  CertificateAgreementInput: CertificateAgreementInput
  CertificateCreationInput: CertificateCreationInput
  Date: ResolverTypeWrapper<Scalars['Date']>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>
  ID: ResolverTypeWrapper<Scalars['ID']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  JWT: ResolverTypeWrapper<Scalars['JWT']>
  Latitude: ResolverTypeWrapper<Scalars['Latitude']>
  Longitude: ResolverTypeWrapper<Scalars['Longitude']>
  Mutation: ResolverTypeWrapper<{}>
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']>
  OrderDirection: OrderDirection
  Pagination: Pagination
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>
  Post: ResolverTypeWrapper<Post>
  PostCreationInput: PostCreationInput
  PostUpdateInput: PostUpdateInput
  Query: ResolverTypeWrapper<{}>
  ServiceAgreement: ResolverTypeWrapper<ServiceAgreement>
  ServiceAgreementInput: ServiceAgreementInput
  Sex: Sex
  String: ResolverTypeWrapper<Scalars['String']>
  Town: ResolverTypeWrapper<Town>
  URL: ResolverTypeWrapper<Scalars['URL']>
  UUID: ResolverTypeWrapper<Scalars['UUID']>
  User: ResolverTypeWrapper<User>
  UserUpdate: UserUpdate
}>

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Any: Scalars['Any']
  Boolean: Scalars['Boolean']
  Certificate: Certificate
  CertificateAgreement: CertificateAgreement
  CertificateAgreementInput: CertificateAgreementInput
  CertificateCreationInput: CertificateCreationInput
  Date: Scalars['Date']
  DateTime: Scalars['DateTime']
  EmailAddress: Scalars['EmailAddress']
  ID: Scalars['ID']
  Int: Scalars['Int']
  JWT: Scalars['JWT']
  Latitude: Scalars['Latitude']
  Longitude: Scalars['Longitude']
  Mutation: {}
  NonEmptyString: Scalars['NonEmptyString']
  NonNegativeInt: Scalars['NonNegativeInt']
  Pagination: Pagination
  PositiveInt: Scalars['PositiveInt']
  Post: Post
  PostCreationInput: PostCreationInput
  PostUpdateInput: PostUpdateInput
  Query: {}
  ServiceAgreement: ServiceAgreement
  ServiceAgreementInput: ServiceAgreementInput
  String: Scalars['String']
  Town: Town
  URL: Scalars['URL']
  UUID: Scalars['UUID']
  User: User
  UserUpdate: UserUpdate
}>

export interface AnyScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Any'], any> {
  name: 'Any'
}

export type CertificateResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Certificate'] = ResolversParentTypes['Certificate']
> = ResolversObject<{
  birthDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  effectiveDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  issueDate?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  sex?: Resolver<ResolversTypes['Sex'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type CertificateAgreementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CertificateAgreement'] = ResolversParentTypes['CertificateAgreement']
> = ResolversObject<{
  immunizationSince?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  sexualCrimeSince?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  showBirthyear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showImmunizationDetails?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showName?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showSTDTestDetails?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showSexualCrimeDetails?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  stdTestSince?: Resolver<Maybe<ResolversTypes['Date']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
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
  connectToGoogleOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  connectToKakaoOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  connectToNaverOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  createPost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationCreatePostArgs, 'input'>
  >
  deletePost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeletePostArgs, 'id'>
  >
  disconnectFromGoogleOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  disconnectFromKakaoOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  disconnectFromNaverOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  logout?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  submitCertificateInfo?: Resolver<
    Maybe<ResolversTypes['Boolean']>,
    ParentType,
    ContextType,
    RequireFields<MutationSubmitCertificateInfoArgs, 'input'>
  >
  takeAttendance?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  unregister?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updatePost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdatePostArgs, 'input'>
  >
  updateUser?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationUpdateUserArgs, 'input'>
  >
  verifyTown?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<MutationVerifyTownArgs, 'lat' | 'lon'>
  >
  wakeUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
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

export type PostResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']
> = ResolversObject<{
  author?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['NonEmptyString']>, ParentType, ContextType>
  creationTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  deletionTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<Maybe<ResolversTypes['URL']>>>, ParentType, ContextType>
  likeCount?: Resolver<Maybe<ResolversTypes['NonNegativeInt']>, ParentType, ContextType>
  modificationTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  getCertificateJWT?: Resolver<
    ResolversTypes['JWT'],
    ParentType,
    ContextType,
    Partial<QueryGetCertificateJwtArgs>
  >
  getMyCertificates?: Resolver<Maybe<Array<ResolversTypes['Certificate']>>, ParentType, ContextType>
  isUniqueNickname?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryIsUniqueNicknameArgs, 'nickname'>
  >
  me?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  post?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryPostArgs, 'id'>
  >
  posts?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>
  userByNickname?: Resolver<
    Maybe<ResolversTypes['User']>,
    ParentType,
    ContextType,
    RequireFields<QueryUserByNicknameArgs, 'nickname'>
  >
  verifyCertificateJWT?: Resolver<
    Maybe<ResolversTypes['Certificate']>,
    ParentType,
    ContextType,
    RequireFields<QueryVerifyCertificateJwtArgs, 'jwt'>
  >
}>

export type ServiceAgreementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ServiceAgreement'] = ResolversParentTypes['ServiceAgreement']
> = ResolversObject<{
  adAgreement?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  adAgreementTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  locationAgreement?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  locationAgreementTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  personalDataStoringYear?: Resolver<
    Maybe<ResolversTypes['NonNegativeInt']>,
    ParentType,
    ContextType
  >
  privacyAgreement?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  privacyAgreementTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  termsAgreement?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  termsAgreementTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type TownResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Town'] = ResolversParentTypes['Town']
> = ResolversObject<{
  count?: Resolver<ResolversTypes['NonNegativeInt'], ParentType, ContextType>
  name?: Resolver<ResolversTypes['NonEmptyString'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
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
  blockingEndTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  blockingStartTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  certificateAgreement?: Resolver<
    Maybe<ResolversTypes['CertificateAgreement']>,
    ParentType,
    ContextType
  >
  cherry?: Resolver<ResolversTypes['NonNegativeInt'], ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['EmailAddress']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<ResolversTypes['URL']>>, ParentType, ContextType>
  isVerifiedBirthday?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isVerifiedBirthyear?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isVerifiedEmail?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isVerifiedName?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isVerifiedPhoneNumber?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  isVerifiedSex?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  serviceAgreement?: Resolver<Maybe<ResolversTypes['ServiceAgreement']>, ParentType, ContextType>
  sex?: Resolver<ResolversTypes['Sex'], ParentType, ContextType>
  towns?: Resolver<Maybe<Array<ResolversTypes['Town']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = any> = ResolversObject<{
  Any?: GraphQLScalarType
  Certificate?: CertificateResolvers<ContextType>
  CertificateAgreement?: CertificateAgreementResolvers<ContextType>
  Date?: GraphQLScalarType
  DateTime?: GraphQLScalarType
  EmailAddress?: GraphQLScalarType
  JWT?: GraphQLScalarType
  Latitude?: GraphQLScalarType
  Longitude?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  NonEmptyString?: GraphQLScalarType
  NonNegativeInt?: GraphQLScalarType
  PositiveInt?: GraphQLScalarType
  Post?: PostResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  ServiceAgreement?: ServiceAgreementResolvers<ContextType>
  Town?: TownResolvers<ContextType>
  URL?: GraphQLScalarType
  UUID?: GraphQLScalarType
  User?: UserResolvers<ContextType>
}>
