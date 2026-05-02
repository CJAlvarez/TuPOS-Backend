import { Product } from '../entities/product.entity';
import { UpdateProductStatusDto } from './dto/update-product-status.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { UtilsService } from 'src/utils/utils.service';
import { GetProductsQueryDto } from './dto/get-products-query.dto';
export declare class ProductsService {
    private readonly productModel;
    private readonly utilsService;
    constructor(productModel: typeof Product, utilsService: UtilsService);
    findAll(query: GetProductsQueryDto, id_store?: number): Promise<{
        count: number;
        list: Product[];
        skip: number;
    }>;
    getProductsPOS(query: GetProductsQueryDto, id_store?: number): Promise<{
        count: number;
        list: Product[];
        skip: number;
    }>;
    findOne(id: number, storeId: number): Promise<Product | null>;
    create(internal_user_id: number, internal_store_id: number, dto: CreateProductDto): Promise<Product>;
    update(dto: UpdateProductDto, storeId: number): Promise<[number, Product[]]>;
    remove(internal_user_id: number, id: number, storeId: number): Promise<any>;
    updateStatus(internal_user_id: number, dto: UpdateProductStatusDto, storeId: number): Promise<[number, Product[]]>;
}
