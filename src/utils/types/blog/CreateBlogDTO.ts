type CreateBlogDTO = {
  title: string;
  content: string;
} & Partial<{ thumbnail: string; heading: string }>;

export default CreateBlogDTO;
