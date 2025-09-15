import { DataSource } from 'typeorm';
import { Category } from './categories/entities/category.entity';
import { Organization } from './organizations/entities/organization.entity';
import { Product } from './products/entities/product.entity';
import { User } from './users/entities/user.entity';
import { ProductStatus } from './utils/enums';

async function seedProducts() {
  const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'palestine_donationshop',
    entities: [Product, User, Category, Organization],
    synchronize: true,
  });

  await dataSource.initialize();

  const productRepository = dataSource.getRepository(Product);
  const userRepository = dataSource.getRepository(User);
  const categoryRepository = dataSource.getRepository(Category);
  const organizationRepository = dataSource.getRepository(Organization);

  try {
    // Create a sample seller user
    let seller = await userRepository.findOne({ where: { email: 'seller@palestine.com' } });
    if (!seller) {
      seller = userRepository.create({
        email: 'seller@palestine.com',
        password: '$2b$10$example', // This would be hashed in real scenario
        username: 'palestine_seller',
        role: 'SELLER' as any,
        is_active: true,
      });
      seller = await userRepository.save(seller);
    }

    // Create a sample admin user
    let admin = await userRepository.findOne({ where: { email: 'admin@palestine.com' } });
    if (!admin) {
      admin = userRepository.create({
        email: 'admin@palestine.com',
        password: '$2b$10$example', // This would be hashed in real scenario
        username: 'palestine_admin',
        role: 'ADMIN' as any,
        is_active: true,
      });
      admin = await userRepository.save(admin);
    }

    // Create sample categories
    let booksCategory = await categoryRepository.findOne({ where: { name_en: 'Books' } });
    if (!booksCategory) {
      booksCategory = categoryRepository.create({
        name_ar: 'كتب',
        name_en: 'Books',
        icon: '📚',
        color: '#4CAF50',
      });
      booksCategory = await categoryRepository.save(booksCategory);
    }

    let clothingCategory = await categoryRepository.findOne({ where: { name_en: 'Clothing' } });
    if (!clothingCategory) {
      clothingCategory = categoryRepository.create({
        name_ar: 'ملابس',
        name_en: 'Clothing',
        icon: '👕',
        color: '#FF9800',
      });
      clothingCategory = await categoryRepository.save(clothingCategory);
    }

    // Create sample organization
    let organization = await organizationRepository.findOne({ where: { name_en: 'Palestine Relief Fund' } });
    if (!organization) {
      organization = organizationRepository.create({
        name_ar: 'صندوق الإغاثة الفلسطيني',
        name_en: 'Palestine Relief Fund',
        description_ar: 'منظمة غير ربحية لدعم الشعب الفلسطيني',
        description_en: 'Non-profit organization supporting Palestinian people',
        logo_url: 'https://via.placeholder.com/100x100/4CAF50/FFFFFF?text=PRF',
        blockchain_address: '0x1234567890abcdef1234567890abcdef12345678',
        total_received: 0,
        is_verified: true,
        created_by: admin.user_id,
      });
      organization = await organizationRepository.save(organization);
    }

    // Create sample products
    const sampleProducts = [
      {
        name_ar: 'كتاب تاريخ فلسطين',
        name_en: 'History of Palestine Book',
        description_ar: 'كتاب شامل عن تاريخ فلسطين العريق',
        description_en: 'Comprehensive book about the rich history of Palestine',
        price: 25.00,
        image_url: 'https://via.placeholder.com/300x400/4CAF50/FFFFFF?text=Palestine+Book',
        is_active: true,
        is_approved: true,
        approval_status: ProductStatus.APPROVED,
        seller: seller,
        creator: admin,
        category: booksCategory,
        organization: organization,
      },
      {
        name_ar: 'ثوب فلسطيني تقليدي',
        name_en: 'Traditional Palestinian Dress',
        description_ar: 'ثوب فلسطيني تقليدي مطرز باليد',
        description_en: 'Traditional Palestinian dress hand-embroidered',
        price: 150.00,
        image_url: 'https://via.placeholder.com/300x400/FF9800/FFFFFF?text=Palestinian+Dress',
        is_active: true,
        is_approved: true,
        approval_status: ProductStatus.APPROVED,
        seller: seller,
        creator: admin,
        category: clothingCategory,
        organization: organization,
      },
      {
        name_ar: 'كتاب المطبخ الفلسطيني',
        name_en: 'Palestinian Cookbook',
        description_ar: 'كتاب يحتوي على وصفات المطبخ الفلسطيني الأصيل',
        description_en: 'Cookbook containing authentic Palestinian recipes',
        price: 30.00,
        image_url: 'https://via.placeholder.com/300x400/9C27B0/FFFFFF?text=Cookbook',
        is_active: true,
        is_approved: true,
        approval_status: ProductStatus.APPROVED,
        seller: seller,
        creator: admin,
        category: booksCategory,
        organization: organization,
      },
    ];

    for (const productData of sampleProducts) {
      const existingProduct = await productRepository.findOne({
        where: { name_en: productData.name_en }
      });

      if (!existingProduct) {
        const product = productRepository.create(productData);
        await productRepository.save(product);
        console.log(`Created product: ${productData.name_en}`);
      } else {
        console.log(`Product already exists: ${productData.name_en}`);
      }
    }

    console.log('Sample products seeded successfully!');
  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await dataSource.destroy();
  }
}

seedProducts();
