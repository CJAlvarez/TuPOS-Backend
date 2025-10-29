import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { Product } from 'src/entities/product.entity';
import { ProductsService } from './products.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getProducts(req: any, query: GetProductsQueryDto): Promise<{
        count: number;
        list: Product[];
        skip: number;
    }>;
    getProductsPOS(req: any, query: GetProductsQueryDto): Promise<{
        count: number;
        list: Product[];
        skip: number;
    }>;
    findOne(id: string): Promise<Product | null>;
    create(req: any, data: CreateProductDto): Promise<Product>;
    update(dto: UpdateProductDto): Promise<[number, Product[]]>;
    remove(req: any, id: string): Promise<number>;
    updateStatus(req: any, dto: UpdateProductStatusDto): Promise<[number, Product[]]>;
}
