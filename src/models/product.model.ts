export interface Product {
  ProductId: string;
  Name: string;
  Description?: string;
  Price: number;
  Category: string; // Must match a valid category in `ProductTaxonomyAttributes`
  Tags?: string[]; // Must match valid tags in `ProductTaxonomyAttributes`
  Stock: number;
  CreatedAt: string;
  UpdatedAt: string;
}
