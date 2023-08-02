const Footer = () => {
  function getYear() {
    return new Date().getFullYear();
  }

  return (
    <footer>
      <p>&copy; Sam Screpnek {getYear()}</p>
    </footer>
  );
};

export default Footer;
