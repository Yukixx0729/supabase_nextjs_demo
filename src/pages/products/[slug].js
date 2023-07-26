import { useRouter } from "next/router";
import { supabase } from "supabase";
import Image from "next/image";
import PromoCard from "src/products/components/PromoCard";

export default function ProductPage({ product }) {
  //   const router = useRouter();
  //   return <div>{router.query.slug}</div>;
  console.log(product);
  return (
    <section className="product-section">
      <article className="product">
        <div className="product-wrap">
          <Image
            width={1000}
            height={300}
            src={`/assets/${product.slug}.png`}
            alt={product.name}
          />
        </div>
        <section>
          <header>
            <h3>{product.name}</h3>
          </header>
          <section>
            <div>
              <p>{product.description}</p>
            </div>
          </section>
        </section>
        <section>
          <PromoCard />
        </section>
      </article>
    </section>
  );
}

export async function getStaticPaths() {
  const { data: products } = await supabase.from("product").select("slug");
  const paths = products.map((product) => ({
    params: {
      slug: product.slug,
    },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;

  let { data: product, error } = await supabase
    .from("product")
    .select("*")

    // Filters
    .eq("slug", slug)
    .single();

  return {
    props: { product },
  };
}
