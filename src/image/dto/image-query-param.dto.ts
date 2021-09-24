export class ImageQueryParam {
  populate: string[] = [];
  filter: ImageQueryParamFilter = new ImageQueryParamFilter();
}

export class ImageQueryParamFilter {
  pagesTags: any = {};
}
