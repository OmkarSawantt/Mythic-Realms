import { Element } from "react-scroll";
import picture2 from '../images/Picture2.png';
import button1 from '../images/button.svg';
import { useNavigate } from "react-router-dom";
const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative pt-60 pb-40 min-h-screen max-lg:pt-52 max-lg:pb-36 max-md:pt-36 max-md:pb-32">
      <Element name="hero">
        <div className="container1">
          <div className="relative z-2 max-w-512 max-lg:max-w-388">
            <h1 className="mb-6 h1 text-p4 font-Inknut    max-lg:mb-7 max-lg:h2 max-md:mb-4 max-md:text-5xl max-md:leading-12">
              Mythic Realms
            </h1>
            <p className="max-w-440 mb-6  body-1 ">
            Conquer, Collect, and Earn!
            </p>
            <button onClick={()=>navigate('/home')} >

            <img
              src={button1}
              alt="button"
              className="w-60 hover:w-64 transition-all duration-300 ease-in-out cursor-pointer"
              />
</button>
          </div>

          <div className="absolute -top-32 left-[calc(50%-340px)] w-[1230px] pointer-events-none hero-img_res">
            <img
              src={picture2}
              className="size-1230 max-lg:h-auto  mix-blend-color-dodge "
              alt="hero"
            />
          </div>
        </div>
      </Element>
    </section>
  );
};

export default Hero;
