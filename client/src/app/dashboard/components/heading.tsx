interface HeadingProps {
  heading: string;
  subheading?: string;
  children?: React.ReactNode;
}

export const Heading: React.FC<HeadingProps> = ({
  heading,
  subheading,
  children,
}) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-2xl lg:text-3xl text-primary font-semibold tracking-wide">
            {heading}
          </h1>
          {subheading && (
            <h4 className="text-accent-foreground mt-0.5 text-sm">
              {subheading}
            </h4>
          )}
        </div>
        <div>{children}</div>
      </div>
      <hr className="text-border bg-border mt-3" />
    </div>
  );
};
