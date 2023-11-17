import { PropTypes } from "prop-types";

export default function CustomAvatar({ name, subtitle, image_URL }) {
  return (
    <>
      <div className="flex space-x-4 items-center">
        {/* <Image
        src={image_URL ?? "/test.png"}
        alt="User profile picture"
        width={36}
        height={36}
        className="rounded-full ring ring-neutral-600 h-[36px]"
      /> */}
        <img
          src={image_URL ?? "/test.png"}
          alt="User profile picture"
          className="rounded-full ring ring-neutral-300 h-9 w-9"
        />
        <div className="flex-col xs:hidden flex">
          <p className="text-neutral-800 font-medium">{name ?? "User"}</p>
          <p className="text-neutral-600  text-sm">
            {subtitle ? subtitle : "Product designer"}
          </p>
        </div>
      </div>

      {/* <Card style={{ maxWidth: 240 }}>
        <Flex gap="3" align="center">
          <Avatar
            size="2"
            src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
            radius="full"
            fallback="CG"
            variant="soft"
          />
          <Box>
            <Text as="div" size="1" weight="bold">
              Teodros Girmay
            </Text>
            <Link size="1" color="gray">
              t.girmay@example.com
            </Link>
          </Box>
        </Flex>
      </Card> */}
    </>
  );
}

CustomAvatar.propTypes = {
  name: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  image_URL: PropTypes.string,
};
