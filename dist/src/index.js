import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import AWS from "aws-sdk";
AWS.config.update({
    region: "us-east-1",
});
const dynamodb = new AWS.DynamoDB.DocumentClient();
const typeDefs = `#graphql
 
  type Disease {
    diseaseName: String!
  }
  input DiseaseInput {
    diseaseName: String!
  }

  type Patient {
    patient_id: String!
    fullName: String!
    fatherName: String
    CNICNumber: String
    type: String!
    email: String!
    phoneNumber: String!
    address: String
    disease: [Disease!]
  }
  input PatientInput {
    patient_id: String!
    fullName: String!
    fatherName: String
    CNICNumber: String
    type: String!
    email: String!
    phoneNumber: String!
    address: String
    disease: [DiseaseInput!]
  }

  type Doctor {
    name: String!
    doctor_id: String!
    CNICNumber: String
    email: String!
    type: String!
    phoneNumber: String!
    clinicAddress: String
  }
  input DoctorInput {
    name: String!
    doctor_id: String!
    CNICNumber: String!
    email: String!
    type: String!
    phoneNumber: String!
    clinicAddress: String!
  }

  type Query {
    patients: [Patient!]!
    doctors: [Doctor!]!
  }

  type Mutation {
    addPatient(patient: PatientInput): String!
    updatePatient(disease: [String!]): String!
    addDoctor(doctor: DoctorInput): String!
  }
`;
const resolvers = {
    Query: {
        patients: async () => {
            const params = {
                TableName: "madrack_patients",
            };
            const result = await dynamodb.scan(params).promise();
            return result.Items;
        },
        doctors: async () => {
            const params = {
                TableName: "madrack_doctors",
            };
            const result = await dynamodb.scan(params).promise();
            return result.Items;
        },
    },
    Mutation: {
        addPatient: async (_, { patient }) => {
            const params = {
                TableName: "madrack_patients",
                Item: patient,
            };
            await dynamodb.put(params).promise();
            return "Congrats Data Enterd";
        },
        addDoctor: async (_, { doctor }) => {
            const params = {
                TableName: "madrack_doctors",
                Item: doctor,
            };
            await dynamodb.put(params).promise();
            return "Doctor Records Added Successfully!!";
        },
        updatePatient: async (_, { patient }) => {
            const params = {
                TableName: 'madrack_patients',
                Key: { patient_id: "1122" },
                UpdateExpression: 'set #s = :s',
                ExpressionAttributeNames: { '#s': 'disease' },
                ExpressionAttributeValues: { ':s': patient },
                ReturnValues: 'ALL_NEW',
            };
            const result = await dynamodb.update(params).promise();
            return "Data Updated !!";
        }
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
});
console.log(`🚀  Server ready at: ${url}`);
