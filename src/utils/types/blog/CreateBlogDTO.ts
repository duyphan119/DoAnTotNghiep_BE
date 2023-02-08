type CreateBlogDTO = {
  title: string;
  content: string;
} & Partial<{ thumbnail: string }>;

export default CreateBlogDTO;
