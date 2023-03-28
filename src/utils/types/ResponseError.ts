type ResponseError<T> = {
  type: string;
  errors: T[];
  message: string;
};

export default ResponseError;
