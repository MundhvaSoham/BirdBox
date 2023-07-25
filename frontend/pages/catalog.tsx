import { Spinner } from "../components/basic/spinner";
import Container from "../components/container";
import Layout from "../components/layout";
import Navbar from "../components/navbar";
import { ProductCard } from "../components/product-card";
import { useProducts } from "../hooks/use-products";

// Demo product data
const demoProducts = [
  {
    id: 1,
    name: "Speak as they speak Darija",
    price: 49.99,
    description: "Discover the heart and soul of Morocco with our ultimate guidebook to Moroccan Arabic and culture. Our comprehensive book offers practical tips to help you navigate your way through the country with ease.",
    image: "/photo-1564507004663-b6dfb3c824d5.jpeg", // Provide a valid relative URL starting with "/"
    slug: "demo-product-1",
  },
  {
    id: 2,
    name: "Preorder Hollow Graphic Novel - Swag Bundle",
    price: 29.99,
    description: "Hollow is the story of a former magical boy who sealed the Amulets and saved the world, and is trying to live a normal life after the adventures and trauma of his magical life.",
    image: "/no.jpeg", // Provide a valid relative URL starting with "/"
    slug: "demo-product-2",
  },
  {
    id: 3,
    name: "Abstraakt",
    price: 14.99,
    description: "Abstraakt is a pack of custom 3D objects suitable for any kind of project. Create stunning, unique projects with these hand crafted abstract objects, easily editable in Figma, and fully customizable in Cinema 4D.",
    image: "/01_Abstraakt_Cover.png", // Provide a valid relative URL starting with "/"
    slug: "demo-product-3",
  },
  {
    id: 4,
    name: "Jingsketch Procreate Brushes: Complete Collection v2.0",
    price: 19.99,
    description: "Bring your ideas to life with the Complete Collection — all of my 50+ time-saving brushes and 5 color palettes used by professional and aspiring artists around the world.",
    image: "/4baac138bbeb65789459c0b39044727f.jpg", // Provide a valid relative URL starting with "/"
    slug: "demo-product-3",
  },

  
];

const Catalog = () => {
  const { data: products, isLoading } = useProducts();

  if (isLoading) {
    return (
      <div className="flex justify-center my-14">
        <Spinner />
      </div>
    );
  }

  // Use demoProducts if no actual products available
  const productList =  demoProducts;

  return (
    <div className="grid-cols-1 grid gap-x-6 gap-y-10 md:grid-cols-2">
      {productList.map((product) => (
        <ProductCard key={product.id} product={product} linkToPage />
      ))}
    </div>
  );
};

const CatalogPage = () => {
  return (
    <Layout>
      <Navbar currentPage="dashboard" />
      <Container className="mt-10 max-w-[50rem]">
        <h1 className="text-4xl font-bold mb-6">Catalog</h1>
        <Catalog />
      </Container>
    </Layout>
  );
};

export default CatalogPage;
