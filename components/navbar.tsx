import { useAuth0 } from "@auth0/auth0-react";
import { ReactNode } from 'react';
import {
  Box,
  Flex,
  Avatar,
  HStack,
  Link,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Stack,
  Image
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { HamburgerIcon, CloseIcon, AddIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';

const Links = [];

const NavLink = ({ children }: { children: ReactNode }) => (
  <Link
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    href={'#'}>
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { logout, user } = useAuth0();

  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'} >
          <IconButton
            size={'md'}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={'Open Menu'}
            display={{ md: 'none' }}
            onClick={isOpen ? onClose : onOpen}
          />
          <HStack spacing={8} alignItems={'center'}>
            {/* <Box>Logo</Box> */}
            <NextLink passHref href="/">
              <Link>
                <img src="/logo-classy.png" alt="Convex Logo" width={90} height={18} />
              </Link>
            </NextLink>
            <HStack
              as={'nav'}
              spacing={4}
              display={{ base: 'none', md: 'flex' }}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={'center'}>
            {/* <Box>
              <Button onClick={toggleColorMode} >
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
              </Button>
            </Box> */}
            <NextLink passHref href="/add">
              <Button
                as="a"
                variant={'solid'}
                colorScheme={'orange'}
                size={'sm'}
                mr={4}
                leftIcon={<AddIcon />}>
                Food!
              </Button>
            </NextLink>

            <Menu>
              <MenuButton
                as={Button}
                rounded={'full'}
                variant={'link'}
                cursor={'pointer'}
                minW={0}>
                <Avatar
                  size={'sm'}
                  src={
                    'https://static.wikia.nocookie.net/agk/images/1/18/21499dba0eec71730fdaa0534a82e163.jpg'
                  }
                />
              </MenuButton>
              <MenuList>
                <NextLink href="/delete"><a><MenuItem>Manage Submitted Items</MenuItem></a></NextLink>
                <MenuDivider />
                <MenuItem onClick={() => logout({ returnTo: window.location.origin })}>Log out</MenuItem>
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        {isOpen ? (
          <Box pb={4} display={{ md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </Stack>
          </Box>
        ) : null}
      </Box>
    </>
  );
}
