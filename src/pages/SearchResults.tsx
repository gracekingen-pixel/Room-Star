import { useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";

const mockRooms: Record<string, string[]> = {
  bohemian: [
    "https://blog.buyerselect.com/wp-content/uploads/2017/09/bohemian-style-decorating-ideas.jpg",
    "https://cdn.apartmenttherapy.info/image/upload/v1556038346/at/house%20tours/archive/Celeste%20Buscarini%20House%20Tour/34330eca456e02104cfc23f4b0299ad47425b36f.jpg",
    "https://mosaics.co/cdn/shop/articles/boho-bathroom-style.jpg?v=1723634968",
  ],
  contemporary: [
    "https://www.kanikadesign.com/wp-content/uploads/2025/03/Kanika-Design-1543-Olive-Ave-01-1536x1152-1.jpg",
    "https://www.thespruce.com/thmb/BnQpJN5DuH4OVRdi8Pmmrak257c=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPR-modern-kitchen-ideas-7110474-hero-e78cb87316b847fb87fe807ffd4a0921.jpg",
    "https://habitusfurniture.com/cdn/shop/articles/Contemporary_Bedroom_Blog_Image.jpg?v=1729889057&width=1024",
  ],
  industrial: [
    "https://assets.wfcdn.com/im/10249053/resize-h500-w750%5Ecompr-r85/2039/203906188/default_name.jpg",
    "https://www.tomhowley.co.uk/wp-content/uploads/IndustrialStyleShakerKitchen_gallery2.jpg",
    "https://edwardgeorgelondon.com/wp-content/uploads/2024/07/An_industrial_bathroom_with_a_corrugated_metal_shower_surround_paired_with_matte_black_fixtures_and_hardware4.pngv=1716477022",
  ],
  traditional: [
    "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2018/6/20/0/HSOTG105_310217_1206451.jpg.rend.hgtvcom.1280.960.85.suffix/1529511237732.webp",
    "https://www.burlingtonbathrooms.com/content/upload/1/root/draw-on-character.png",
    "https://originalgranitebracket.com/cdn/shop/articles/Elements_of_a_traditional_kitchen._The_Kitchen_design_blog.jpg?v=1453824243",
  ],
  art: [
    "https://www.thespruce.com/thmb/RGFjPkH59-OzCDKQNsy8Q4iKp6M=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/katefeatherkitchendesign-art-deco-teal-a43387c564ff475eb18090ea815b9d45.jpg",
    "https://longado.com/wp-content/uploads/2023/03/artdecowallart-1024x683.webp",
    "https://images.victorianplumbing.co.uk/images/f0112088-1e29-4180-af95-e012c72691b8/d88d9a3d-7476-4a22-8602-ef2d24013f5a/met1020grn-n-d2.jpg",
  ],
  farmhouse: [
    "https://cdn.prod.website-files.com/62dbfeb613ffea804c16a1a2/680969c6a0548a6bfaf1af76_modern-farmhouse-living-room-ideas-3.jpg",
    "https://cdn.mos.cms.futurecdn.net/U4PPi9tvJhjjPmQxi3UG7E.jpg",
    "https://blog.canadianloghomes.com/wp-content/uploads/2020/12/farmhouse-bedroom-ideas-2.jpg",
  ],
  rustic: [
    "https://blog.canadianloghomes.com/wp-content/uploads/2018/01/rustic-style-interior-design-ideas.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqqt1CMoipUxAXhwW9nKZaiyEo3h_0x66P8w&s",
    "https://st.hzcdn.com/simgs/pictures/bathrooms/striking-rustic-master-bathroom-remodel-abbey-design-remodel-img~1441be1f0c661240_14-3924-1-2b865ab.jpg",
  ],
  coastal: [
    "https://wpcdn.us-midwest-1.vip.tn-cloud.net/www.emeraldcoastmagazine.com/content/uploads/2023/04/v/b/coastal-style-with-a-twist-2.jpg",
    "https://www.thespruce.com/thmb/Z_pzj0-wJ-OdBsZ0cSljpaZeftY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/IMG_29321-954369d01390447b9845452e9c838e00.JPG",
    "https://www.southernliving.com/thmb/EMDoX2qGC-6uF5Q0Sn5agIJ1P2Y=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/2787301_IH_Kiawah38246F_preview-76a3221cdc814ea8b6cdd9b602d0a13e.jpg",
  ],
  minimalist: [
    "https://assets.vogue.com/photos/67dd2aa9423f1e0521dbdcba/master/w_2560%2Cc_limit/Chango%2520-%2520Modern%2520Hamptons%2520Living%2520Room%2520Wide%2520-%2520courtesy%2520of%2520Sarah%2520Elliott.jpg",
    "https://www.thespruce.com/thmb/xaicN_pvawEYO-BSEPNAg_ZT7fg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SSS_Home_Kitchen_012-5c92aafa63ca4235bbed12b8c5756138.jpg",
    "https://www.bhg.com/thmb/_TFVCGoszXE6uE_6UwO54zYVwdQ=/1866x0/filters:no_upscale():strip_icc()/perng-bathroom-black-floating-counter-27cd2556-93307ee5b4ba4eafa996f075b84026ff.jpg"
  ],
  eclectic: [
    "https://chandelierslife.com/cdn/shop/articles/thumbnail_e7af468f-1bd0-4028-ae35-767ae39dffa7.jpg?v=1729759082",
    "https://cdn.decoist.com/wp-content/uploads/2015/09/Wooden-shelves-and-cabinet-doors-bring-farmhouse-charm-to-the-eclectic-kitchen.jpg",
    "https://st.hzcdn.com/simgs/pictures/bathrooms/quail-s-end-at-joshua-tree-julia-chasman-design-img~8901ef650eb6ef38_14-5104-1-716b5e7.jpg",
  ],
  blue: [
    "https://hips.hearstapps.com/hmg-prod/images/sad-3751mangusta-229-1545673617.jpg",
    "https://www.bhg.com/thmb/XaBF94qcFC2CJg6e3DNU1mdQ68k=/3000x0/filters:no_upscale():strip_icc()/102832776_preview-b983ed59379a43beb3f5dbf640745040.jpg",
    "https://hips.hearstapps.com/hmg-prod/images/blue-bedroom-ideas-jeff-schlarb-1627925906.jpeg",
  ],
  green: [
    "https://sugarandcloth.com/wp-content/uploads/2023/05/image-35-640x693.jpeg",
    "https://hips.hearstapps.com/hmg-prod/images/green-kitchen-cabinets-16-64484b02999d7.jpg",
    "https://images.signaturehardware.com/i/signaturehdwr/renew-bath-shoppable-hero-mobile?w=700&fmt=auto",
  ],
  white: [
    "https://www.thespruce.com/thmb/1mzxf8hg6NRcT3xQXFGz0I6nPL4=/2500x0/filters:no_upscale():max_bytes(150000):strip_icc()/51.ColdSpringHarborbyChangoCo.-PrimaryBathroomWidecopy-e436f2a8237d45b5bf329f3203c61781.jpg",
    "https://www.mydomaine.com/thmb/R96fGaAkrMYjIlvNNZl4Ss7gRx8=/4000x0/filters:no_upscale():strip_icc()/Design_CuratedNestPhoto_ErinCoren-01d6c8b176f74b80b2a2766020936f29.jpg",
    "https://hgtvhome.sndimg.com/content/dam/images/hgtv/fullset/2020/2/28/0/RX_HGMAG078-white-bedrooms-04.jpg.rend.hgtvcom.616.462.85.suffix/1582807598651.webp",
  ],
  pink: [
    "https://www.decorilla.com/online-decorating/wp-content/uploads/2025/02/Refined-girls-pink-bedroom-design-by-Decorilla-scaled.jpeg",
    "https://st.hzcdn.com/simgs/d8e10eb602b63865_14-5577/_.jpg",
    "https://www.thespruce.com/thmb/NVRtHLxu2lDgapAukDEhiVTnh5w=/4000x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPR-pink-bathroom-ideas-4692233-hero-890686bc951b4b97849d7d3184a236ad.jpg",
  ],
  purple: [
    "https://www.homestratosphere.com/wp-content/uploads/2019/11/purple-master-bathroom-hz-nov142019-13-min.jpg",
    "https://pahome.com/wp-content/uploads/2025/06/Dusty-Purple-Shaker-Cabinets-in-French-Country-Style.webp",
    "https://www.shutterstock.com/image-illustration/scandinavian-vintage-living-room-white-260nw-2217256041.jpg",
  ],
  red: [
    "https://cdn.mos.cms.futurecdn.net/XEociLP3tHQXtD82V2tJyb.jpg",
    "https://www.thespruce.com/thmb/p7mW63PZaiWjy8_kn1gLs0bcpaM=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/MEDEA414410D0944B3FBF71711C3A3BA59E-f5009df92683465ba76df6b0add37813.jpg",
    "https://s3.amazonaws.com/ideas-after/0c92f5e1-64a6-46b5-b248-145a6485f924.jpeg",
  ],
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResults = () => {
  const query = useQuery();
  const searchTerm = query.get("query")?.toLowerCase() || "";

  // match styles/colors
  const matchedStyles = Object.keys(mockRooms).filter(style =>
    style.includes(searchTerm)
  );

  const results = matchedStyles.flatMap(style =>
    mockRooms[style].map(image => ({ style, image }))
  );

  return (
    <div className="min-h-screen bg-gradient-space">
      <Navigation />
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Results for "{searchTerm}"
          </h2>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((room, index) => (
                <Card key={index} className="shadow-elegant overflow-hidden">
                  <CardContent className="p-0">
                    <img
                      src={room.image}
                      alt={`${room.style} design`}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-xl font-semibold capitalize">
                        {room.style}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-lg text-muted-foreground">
              No results found. Try another style or color!
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default SearchResults;
