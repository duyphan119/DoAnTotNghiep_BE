type CreateCommentProductDTO = {
  productId: number;
  content: string;
  star: number;
} & Partial<{
  parentId: number;
}>;

export default CreateCommentProductDTO;
