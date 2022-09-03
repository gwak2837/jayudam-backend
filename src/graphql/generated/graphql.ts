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

export type Cert = {
  __typename?: 'Cert'
  content?: Maybe<Scalars['String']>
  effectiveDate?: Maybe<Scalars['DateTime']>
  id: Scalars['ID']
  issueDate?: Maybe<Scalars['DateTime']>
  location?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  type: CertType
}

export type CertAgreement = {
  __typename?: 'CertAgreement'
  immunizationSince?: Maybe<Scalars['DateTime']>
  sexualCrimeSince?: Maybe<Scalars['DateTime']>
  showBirthdate: Scalars['Boolean']
  showImmunization: Scalars['Boolean']
  showLegalName: Scalars['Boolean']
  showSTDTest: Scalars['Boolean']
  showSex: Scalars['Boolean']
  showSexualCrime: Scalars['Boolean']
  stdTestSince?: Maybe<Scalars['DateTime']>
}

export type CertAgreementInput = {
  immunizationSince?: InputMaybe<Scalars['DateTime']>
  sexualCrimeSince?: InputMaybe<Scalars['DateTime']>
  showBirthdate?: InputMaybe<Scalars['Boolean']>
  showImmunization?: InputMaybe<Scalars['Boolean']>
  showLegalName?: InputMaybe<Scalars['Boolean']>
  showSTDTest?: InputMaybe<Scalars['Boolean']>
  showSex?: InputMaybe<Scalars['Boolean']>
  showSexualCrime?: InputMaybe<Scalars['Boolean']>
  stdTestSince?: InputMaybe<Scalars['DateTime']>
}

export type CertCreation = {
  birthdate: Scalars['DateTime']
  issueDate: Scalars['DateTime']
  legalName: Scalars['NonEmptyString']
  sex: Sex
  verificationCode: Scalars['NonEmptyString']
}

export enum CertType {
  ClinicalLaboratoryTest = 'CLINICAL_LABORATORY_TEST',
  Immunization = 'IMMUNIZATION',
  SexualCrime = 'SEXUAL_CRIME',
  StdTest = 'STD_TEST',
}

export type Certs = {
  __typename?: 'Certs'
  birthdate?: Maybe<Scalars['DateTime']>
  creationTime: Scalars['DateTime']
  id: Scalars['ID']
  immunizationCerts?: Maybe<Array<Cert>>
  legalName?: Maybe<Scalars['String']>
  sex?: Maybe<Sex>
  sexualCrimeCerts?: Maybe<Array<Cert>>
  stdTestCerts?: Maybe<Array<Cert>>
}

export enum Grade {
  Enterprise = 'ENTERPRISE',
  Free = 'FREE',
  Pro = 'PRO',
}

export type Mutation = {
  __typename?: 'Mutation'
  certJWT: Scalars['JWT']
  createPost?: Maybe<PostCreationResult>
  deletePost?: Maybe<Post>
  deleteSharingPost?: Maybe<PostDeletionResult>
  disconnectFromGoogleOAuth?: Maybe<Scalars['Boolean']>
  disconnectFromKakaoOAuth?: Maybe<Scalars['Boolean']>
  disconnectFromNaverOAuth?: Maybe<Scalars['Boolean']>
  logout?: Maybe<User>
  submitCert?: Maybe<Cert>
  takeAttendance?: Maybe<User>
  toggleLikingPost?: Maybe<Post>
  unregister?: Maybe<User>
  updateMyCertAgreement?: Maybe<CertAgreement>
  updatePost?: Maybe<Post>
  updateUser?: Maybe<User>
  verifyCertJWT?: Maybe<Certs>
  verifyTown?: Maybe<User>
  wakeUser?: Maybe<User>
}

export type MutationCertJwtArgs = {
  input: CertAgreementInput
}

export type MutationCreatePostArgs = {
  input: PostCreationInput
}

export type MutationDeletePostArgs = {
  id: Scalars['ID']
}

export type MutationDeleteSharingPostArgs = {
  sharedPostId: Scalars['ID']
}

export type MutationSubmitCertArgs = {
  input: CertCreation
}

export type MutationToggleLikingPostArgs = {
  id: Scalars['ID']
}

export type MutationUpdateMyCertAgreementArgs = {
  input?: InputMaybe<CertAgreementInput>
}

export type MutationUpdatePostArgs = {
  input: PostUpdateInput
}

export type MutationUpdateUserArgs = {
  input: UserUpdate
}

export type MutationVerifyCertJwtArgs = {
  jwt: Scalars['JWT']
}

export type MutationVerifyTownArgs = {
  lat: Scalars['Latitude']
  lon: Scalars['Longitude']
}

export enum OAuthProvider {
  Google = 'GOOGLE',
  Kakao = 'KAKAO',
  Naver = 'NAVER',
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
  commentCount?: Maybe<Scalars['Int']>
  comments?: Maybe<Array<Post>>
  content?: Maybe<Scalars['String']>
  creationTime?: Maybe<Scalars['DateTime']>
  deletionTime?: Maybe<Scalars['DateTime']>
  doIComment: Scalars['Boolean']
  doIShare: Scalars['Boolean']
  id: Scalars['ID']
  imageUrls?: Maybe<Array<Maybe<Scalars['URL']>>>
  isLiked: Scalars['Boolean']
  likeCount?: Maybe<Scalars['Int']>
  parentAuthor?: Maybe<User>
  sharedCount?: Maybe<Scalars['Int']>
  sharingPost?: Maybe<Post>
  updateTime?: Maybe<Scalars['DateTime']>
}

export type PostCreationInput = {
  content?: InputMaybe<Scalars['String']>
  imageUrls?: InputMaybe<Array<Scalars['URL']>>
  parentPostId?: InputMaybe<Scalars['ID']>
  sharingPostId?: InputMaybe<Scalars['ID']>
}

export type PostCreationResult = {
  __typename?: 'PostCreationResult'
  newPost: Post
  parentPost?: Maybe<Post>
  sharedPost?: Maybe<Post>
}

export type PostDeletionResult = {
  __typename?: 'PostDeletionResult'
  deletedPost?: Maybe<Post>
  sharedPost?: Maybe<Post>
}

export type PostUpdateInput = {
  content: Scalars['NonEmptyString']
  id: Scalars['ID']
  imageUrls?: InputMaybe<Array<Scalars['URL']>>
}

export type Query = {
  __typename?: 'Query'
  auth?: Maybe<User>
  certs?: Maybe<Certs>
  comments?: Maybe<Array<Post>>
  isUniqueUsername: Scalars['Boolean']
  myCertAgreement?: Maybe<CertAgreement>
  pendingCerts?: Maybe<Array<Cert>>
  post?: Maybe<Post>
  posts?: Maybe<Array<Post>>
  sampleCertJWT: Scalars['JWT']
  user?: Maybe<User>
  verificationHistories?: Maybe<Array<Certs>>
}

export type QueryCommentsArgs = {
  lastId?: InputMaybe<Scalars['ID']>
  limit?: InputMaybe<Scalars['PositiveInt']>
  parentId: Scalars['ID']
}

export type QueryIsUniqueUsernameArgs = {
  username: Scalars['NonEmptyString']
}

export type QueryPostArgs = {
  id: Scalars['ID']
}

export type QueryPostsArgs = {
  lastId?: InputMaybe<Scalars['ID']>
  limit?: InputMaybe<Scalars['PositiveInt']>
}

export type QueryUserArgs = {
  name?: InputMaybe<Scalars['NonEmptyString']>
}

export type ServiceAgreement = {
  __typename?: 'ServiceAgreement'
  adAgreement: Scalars['Boolean']
  adAgreementTime?: Maybe<Scalars['DateTime']>
  locationAgreement: Scalars['Boolean']
  locationAgreementTime?: Maybe<Scalars['DateTime']>
  personalDataStoringYear: Scalars['Int']
  privacyAgreement: Scalars['Boolean']
  privacyAgreementTime?: Maybe<Scalars['DateTime']>
  termsAgreement: Scalars['Boolean']
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
  count: Scalars['Int']
  name?: Maybe<Scalars['String']>
}

export type User = {
  __typename?: 'User'
  bio?: Maybe<Scalars['String']>
  birthday?: Maybe<Scalars['String']>
  birthyear?: Maybe<Scalars['Int']>
  blockingEndTime?: Maybe<Scalars['DateTime']>
  blockingStartTime?: Maybe<Scalars['DateTime']>
  certAgreement?: Maybe<CertAgreement>
  cherry?: Maybe<Scalars['Int']>
  coverImageUrls?: Maybe<Array<Scalars['String']>>
  creationTime?: Maybe<Scalars['DateTime']>
  email?: Maybe<Scalars['String']>
  followerCount?: Maybe<Scalars['Int']>
  followingCount?: Maybe<Scalars['Int']>
  grade?: Maybe<Grade>
  id: Scalars['UUID']
  imageUrl?: Maybe<Scalars['String']>
  imageUrls?: Maybe<Array<Scalars['String']>>
  isPrivate?: Maybe<Scalars['Boolean']>
  isSleeping?: Maybe<Scalars['Boolean']>
  isVerifiedBirthday?: Maybe<Scalars['Boolean']>
  isVerifiedBirthyear?: Maybe<Scalars['Boolean']>
  isVerifiedEmail?: Maybe<Scalars['Boolean']>
  isVerifiedName?: Maybe<Scalars['Boolean']>
  isVerifiedPhoneNumber?: Maybe<Scalars['Boolean']>
  isVerifiedSex?: Maybe<Scalars['Boolean']>
  legalName?: Maybe<Scalars['String']>
  logoutTime?: Maybe<Scalars['DateTime']>
  name?: Maybe<Scalars['String']>
  nickname?: Maybe<Scalars['String']>
  oAuthProviders?: Maybe<Array<OAuthProvider>>
  postCount?: Maybe<Scalars['Int']>
  serviceAgreement?: Maybe<ServiceAgreement>
  sex?: Maybe<Sex>
  sleepingTime?: Maybe<Scalars['DateTime']>
  towns?: Maybe<Array<Town>>
}

export type UserUpdate = {
  bio?: InputMaybe<Scalars['NonEmptyString']>
  certAgreement?: InputMaybe<CertAgreementInput>
  email?: InputMaybe<Scalars['EmailAddress']>
  imageUrls?: InputMaybe<Array<Scalars['URL']>>
  name?: InputMaybe<Scalars['NonEmptyString']>
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
  Cert: ResolverTypeWrapper<Cert>
  CertAgreement: ResolverTypeWrapper<CertAgreement>
  CertAgreementInput: CertAgreementInput
  CertCreation: CertCreation
  CertType: CertType
  Certs: ResolverTypeWrapper<Certs>
  DateTime: ResolverTypeWrapper<Scalars['DateTime']>
  EmailAddress: ResolverTypeWrapper<Scalars['EmailAddress']>
  Grade: Grade
  ID: ResolverTypeWrapper<Scalars['ID']>
  Int: ResolverTypeWrapper<Scalars['Int']>
  JWT: ResolverTypeWrapper<Scalars['JWT']>
  Latitude: ResolverTypeWrapper<Scalars['Latitude']>
  Longitude: ResolverTypeWrapper<Scalars['Longitude']>
  Mutation: ResolverTypeWrapper<{}>
  NonEmptyString: ResolverTypeWrapper<Scalars['NonEmptyString']>
  NonNegativeInt: ResolverTypeWrapper<Scalars['NonNegativeInt']>
  OAuthProvider: OAuthProvider
  OrderDirection: OrderDirection
  Pagination: Pagination
  PositiveInt: ResolverTypeWrapper<Scalars['PositiveInt']>
  Post: ResolverTypeWrapper<Post>
  PostCreationInput: PostCreationInput
  PostCreationResult: ResolverTypeWrapper<PostCreationResult>
  PostDeletionResult: ResolverTypeWrapper<PostDeletionResult>
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
  Cert: Cert
  CertAgreement: CertAgreement
  CertAgreementInput: CertAgreementInput
  CertCreation: CertCreation
  Certs: Certs
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
  PostCreationResult: PostCreationResult
  PostDeletionResult: PostDeletionResult
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

export type CertResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Cert'] = ResolversParentTypes['Cert']
> = ResolversObject<{
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  effectiveDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  issueDate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  location?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  type?: Resolver<ResolversTypes['CertType'], ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type CertAgreementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['CertAgreement'] = ResolversParentTypes['CertAgreement']
> = ResolversObject<{
  immunizationSince?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  sexualCrimeSince?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  showBirthdate?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showImmunization?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showLegalName?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showSTDTest?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showSex?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  showSexualCrime?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  stdTestSince?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type CertsResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Certs'] = ResolversParentTypes['Certs']
> = ResolversObject<{
  birthdate?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  creationTime?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  immunizationCerts?: Resolver<Maybe<Array<ResolversTypes['Cert']>>, ParentType, ContextType>
  legalName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  sex?: Resolver<Maybe<ResolversTypes['Sex']>, ParentType, ContextType>
  sexualCrimeCerts?: Resolver<Maybe<Array<ResolversTypes['Cert']>>, ParentType, ContextType>
  stdTestCerts?: Resolver<Maybe<Array<ResolversTypes['Cert']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

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
  certJWT?: Resolver<
    ResolversTypes['JWT'],
    ParentType,
    ContextType,
    RequireFields<MutationCertJwtArgs, 'input'>
  >
  createPost?: Resolver<
    Maybe<ResolversTypes['PostCreationResult']>,
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
  deleteSharingPost?: Resolver<
    Maybe<ResolversTypes['PostDeletionResult']>,
    ParentType,
    ContextType,
    RequireFields<MutationDeleteSharingPostArgs, 'sharedPostId'>
  >
  disconnectFromGoogleOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  disconnectFromKakaoOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  disconnectFromNaverOAuth?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  logout?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  submitCert?: Resolver<
    Maybe<ResolversTypes['Cert']>,
    ParentType,
    ContextType,
    RequireFields<MutationSubmitCertArgs, 'input'>
  >
  takeAttendance?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  toggleLikingPost?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<MutationToggleLikingPostArgs, 'id'>
  >
  unregister?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  updateMyCertAgreement?: Resolver<
    Maybe<ResolversTypes['CertAgreement']>,
    ParentType,
    ContextType,
    Partial<MutationUpdateMyCertAgreementArgs>
  >
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
  verifyCertJWT?: Resolver<
    Maybe<ResolversTypes['Certs']>,
    ParentType,
    ContextType,
    RequireFields<MutationVerifyCertJwtArgs, 'jwt'>
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
  commentCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  comments?: Resolver<Maybe<Array<ResolversTypes['Post']>>, ParentType, ContextType>
  content?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  creationTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  deletionTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  doIComment?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  doIShare?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<Maybe<ResolversTypes['URL']>>>, ParentType, ContextType>
  isLiked?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  likeCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  parentAuthor?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  sharedCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  sharingPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  updateTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PostCreationResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PostCreationResult'] = ResolversParentTypes['PostCreationResult']
> = ResolversObject<{
  newPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType>
  parentPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  sharedPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type PostDeletionResultResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['PostDeletionResult'] = ResolversParentTypes['PostDeletionResult']
> = ResolversObject<{
  deletedPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  sharedPost?: Resolver<Maybe<ResolversTypes['Post']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type QueryResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  auth?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>
  certs?: Resolver<Maybe<ResolversTypes['Certs']>, ParentType, ContextType>
  comments?: Resolver<
    Maybe<Array<ResolversTypes['Post']>>,
    ParentType,
    ContextType,
    RequireFields<QueryCommentsArgs, 'parentId'>
  >
  isUniqueUsername?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType,
    RequireFields<QueryIsUniqueUsernameArgs, 'username'>
  >
  myCertAgreement?: Resolver<Maybe<ResolversTypes['CertAgreement']>, ParentType, ContextType>
  pendingCerts?: Resolver<Maybe<Array<ResolversTypes['Cert']>>, ParentType, ContextType>
  post?: Resolver<
    Maybe<ResolversTypes['Post']>,
    ParentType,
    ContextType,
    RequireFields<QueryPostArgs, 'id'>
  >
  posts?: Resolver<
    Maybe<Array<ResolversTypes['Post']>>,
    ParentType,
    ContextType,
    Partial<QueryPostsArgs>
  >
  sampleCertJWT?: Resolver<ResolversTypes['JWT'], ParentType, ContextType>
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUserArgs>>
  verificationHistories?: Resolver<Maybe<Array<ResolversTypes['Certs']>>, ParentType, ContextType>
}>

export type ServiceAgreementResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['ServiceAgreement'] = ResolversParentTypes['ServiceAgreement']
> = ResolversObject<{
  adAgreement?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  adAgreementTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  locationAgreement?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  locationAgreementTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  personalDataStoringYear?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  privacyAgreement?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  privacyAgreementTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  termsAgreement?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>
  termsAgreementTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type TownResolvers<
  ContextType = any,
  ParentType extends ResolversParentTypes['Town'] = ResolversParentTypes['Town']
> = ResolversObject<{
  count?: Resolver<ResolversTypes['Int'], ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
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
  birthday?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  birthyear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  blockingEndTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  blockingStartTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  certAgreement?: Resolver<Maybe<ResolversTypes['CertAgreement']>, ParentType, ContextType>
  cherry?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  coverImageUrls?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  creationTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  followerCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  followingCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  grade?: Resolver<Maybe<ResolversTypes['Grade']>, ParentType, ContextType>
  id?: Resolver<ResolversTypes['UUID'], ParentType, ContextType>
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  imageUrls?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>
  isPrivate?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isSleeping?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isVerifiedBirthday?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isVerifiedBirthyear?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isVerifiedEmail?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isVerifiedName?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isVerifiedPhoneNumber?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  isVerifiedSex?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>
  legalName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  logoutTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  nickname?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>
  oAuthProviders?: Resolver<Maybe<Array<ResolversTypes['OAuthProvider']>>, ParentType, ContextType>
  postCount?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>
  serviceAgreement?: Resolver<Maybe<ResolversTypes['ServiceAgreement']>, ParentType, ContextType>
  sex?: Resolver<Maybe<ResolversTypes['Sex']>, ParentType, ContextType>
  sleepingTime?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>
  towns?: Resolver<Maybe<Array<ResolversTypes['Town']>>, ParentType, ContextType>
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>
}>

export type Resolvers<ContextType = any> = ResolversObject<{
  Any?: GraphQLScalarType
  Cert?: CertResolvers<ContextType>
  CertAgreement?: CertAgreementResolvers<ContextType>
  Certs?: CertsResolvers<ContextType>
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
  PostCreationResult?: PostCreationResultResolvers<ContextType>
  PostDeletionResult?: PostDeletionResultResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  ServiceAgreement?: ServiceAgreementResolvers<ContextType>
  Town?: TownResolvers<ContextType>
  URL?: GraphQLScalarType
  UUID?: GraphQLScalarType
  User?: UserResolvers<ContextType>
}>
