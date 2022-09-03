import { Box, Button, Flex, Image, Input, PinInputDescendantsProvider, Select, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useRef, useState, useMemo } from "react";
import Webcam from "react-webcam";
import { useMutation, useQuery } from "../convex/_generated/react";
import Fuse from 'fuse.js';
import { useUserID } from './_app';
import ms from 'ms'
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
} from '@chakra-ui/react'

export default function DeleteFood() {
    const foodItems = useQuery("listFoodFromUser", useUserID()) || [];
    // const ID = useUserID()['id'];
    // const searcher = useMemo(() => {
    //     return new Fuse(foodItems, {
    //     keys: ["userID"],
    //     });
    // }, [foodItems]);
    // const [user] = useState("");
    // const results = useMemo(() => {
    //     return searcher.search(ID);
    //   }, [searcher, ID]);
    const deleteFoodItem = useMutation("deleteFoodItem");
    const handleClick = (id) => {  
        deleteFoodItem(id);
     };
    return <Box>
        <Box p={4} textAlign="center">
            Delete Food
        </Box>
        <Box maxWidth={800} mx="auto">
            <TableContainer>
                <Table variant='simple'>
                    <TableCaption>All of your foods.</TableCaption>
                    <Thead>
                        <Tr>
                            <Th>Time</Th>
                            <Th>Description</Th>
                            <Th>Picture</Th>
                            <Th>Delete</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {/* <Tr>
                            <Td>inches</Td>
                            <Td>millimetres (mm)</Td>
                            <Td isNumeric>25.4</Td>
                        </Tr>
                        <Tr>
                            <Td>feet</Td>
                            <Td>centimetres (cm)</Td>
                            <Td isNumeric>30.48</Td>
                        </Tr>
                        <Tr>
                            <Td>yards</Td>
                            <Td>metres (m)</Td>
                            <Td isNumeric>0.91444</Td>
                        </Tr> */}
                        {foodItems.map((foodItem) => {
                            // For each food item, return an annotation.
                            return <Tr>
                                <Td>{ms(foodItem.createdAt)}</Td>
                                <Td>{foodItem.description}</Td>
                                <Td>{foodItem.photo !== null && <Image boxSize='70px' src={foodItem.photo} />}</Td>
                                <Td><Button onClick={()=> deleteFoodItem(foodItem._id)}>Delete</Button></Td>
                            </Tr>
                        })}
                    </Tbody>
                </Table>
            </TableContainer>

        </Box>
    </Box>;
}