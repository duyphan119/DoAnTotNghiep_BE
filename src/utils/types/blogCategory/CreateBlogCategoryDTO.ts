type CreateBlogCategoryDTO = {
  name: string;
} & Partial<{ desciption: string }>;
export default CreateBlogCategoryDTO;
