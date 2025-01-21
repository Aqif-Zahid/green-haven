import { ProductRow } from "./components/ProductRow";

export default function Home() {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      <div className="mac-w-3xl mx-auto text-2xl sm:text-5xl lg:text-6xl font-semibold text-center">
        <h1 className="text-primary">Find the best Plants,</h1>
        <h1>Gardening Accessories and Flowers</h1>
        <p className="lg:text-lg text-muted-foreground mx-auto mt-5 w-[90%] font-normal text-base">
          Green Haven stands out as the premier marketplace for plants and all things related
          to gardens, offering an uparalleled platform for both buyers and sellers alike.
          
        </p>

      </div>
      <ProductRow category="newest"/>
      <ProductRow category="plants"/>
      <ProductRow category="accessories"/>
      <ProductRow category="flowers"/>
    </section>
  );
}
































/**   HOMEPAGE INFO:       Whether you're looking to sell your plants from your own nursery, a florist wanting
          to sell your flowers or a gardening enthusiast seeking high quality plants or 
          gardening accessories, Green Haven provides the ideal environment for your needs.
          Aside from our marketplace, we also have a blog for our users to share gardening 
          tips and advice as well as information on any horticulurists around you for more
          professional help with your plants. */