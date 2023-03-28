type CreateBlogDTO = {
  title: string;
  content: string;
  userId: number;
} & Partial<{
  thumbnail: string;
  heading: string;
  metaDescription: string;
  metaKeywords: string;
}>;

export default CreateBlogDTO;
