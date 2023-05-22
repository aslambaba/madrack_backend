import mongoose, { Schema } from "mongoose";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { gql } from "apollo-server";
const DoctorsTreated = new Schema({
    doctorName: { type: String, required: true },
    hospitalName: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    doctorDescription: { type: String, required: true },
});
const PatientDisease = new Schema({
    diseaseName: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    doctors: { type: [DoctorsTreated] },
});
const patientSchema = new Schema({
    patient_id: { type: String, required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    fatherName: { type: String },
    CNICNumber: { type: String },
    address: { type: String },
    disease: { type: [PatientDisease] },
});
const PatientModel = mongoose.model("Patients", patientSchema);
const DoctorExperience = new Schema({
    positionName: { type: String, required: true },
    hospitalName: { type: String, required: true },
});
const DoctorDegree = new Schema({
    degreeName: { type: String, required: true },
    instituteName: { type: String, required: true },
    passingYear: { type: String, required: true },
});
const DoctorSchema = new Schema({
    doctor_id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    type: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    CNICNumber: { type: String },
    clinicAddress: { type: String },
    degree: { type: [DoctorDegree] },
    experience: { type: [DoctorExperience] },
});
const DoctorModel = mongoose.model("Doctors", DoctorSchema);
await mongoose
    .connect("mongodb+srv://aslambaba:aslambaba91r@maindatabase.mxkbqt7.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then((res) => {
    console.log("Connected to Distribution API Database - Initial Connection");
    return res;
})
    .catch((err) => {
    console.log(`Initial Distribution API Database connection error occured -`, err);
});
const typeDefs = gql `
  type DoctorsTreated {
    _id: String!
    doctorName: String!
    hospitalName: String!
    startDate: String!
    endDate: String!
    doctorDescription: String!
  }
  type Disease {
    _id: String!
    diseaseName: String!
    description: String!
    status: String!
    startDate: String!
    endDate: String!
    doctors: [DoctorsTreated]
  }
  input DoctorsTreatedInput {
    doctorName: String!
    hospitalName: String!
    startDate: String!
    endDate: String!
    doctorDescription: String!
  }
  input DiseaseInput {
    diseaseName: String!
    description: String!
    status: String!
    startDate: String!
    endDate: String!
    doctors: [DoctorsTreatedInput]
  }
  type Patient {
    _id: String!
    patient_id: String!
    fullName: String!
    fatherName: String
    CNICNumber: String
    type: String!
    email: String!
    phoneNumber: String!
    address: String
    disease: [Disease]
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
    disease: [DiseaseInput]
  }
  input AddPatientDisease {
    patient_id: String!
    disease: [DiseaseInput]
  }

  type Experience {
    _id: String!
    positionName: String!
    hospitalName: String!
  }
  type Degree {
    _id: String!
    degreeName: String!
    instituteName: String!
    passingYear: String!
  }
  type Doctor {
    _id: String!
    name: String!
    doctor_id: String!
    CNICNumber: String
    email: String!
    type: String!
    phoneNumber: String!
    clinicAddress: String
    degree: [Degree]
    experience: [Experience]
  }
  input ExperienceInput {
    positionName: String!
    hospitalName: String!
  }
  input DegreeInput {
    degreeName: String!
    instituteName: String!
    passingYear: String!
  }
  input DoctorInput {
    name: String!
    doctor_id: String!
    CNICNumber: String
    email: String!
    type: String!
    phoneNumber: String!
    clinicAddress: String
    degree: [DegreeInput]
    experience: [ExperienceInput]
  }

  type Query {
    getAllPatients: [Patient!]!
    getPatientRecord(patient_id: String): Patient
    getPatientRecordByEmail(email: String): Patient

    doctors: [Doctor!]!
    getDoctorRecord(doctor_id: String): Doctor
  }

  type Mutation {
    addPatient(patient: PatientInput): String!
    updatePatient(patient: AddPatientDisease): String!
    updatePatientInfo(patient: PatientInput): String!
    deletePatient(patient_id: String): String!

    addDoctor(doctor: DoctorInput): String!
    updateDoctor(doctor: DoctorInput): String!
  }
`;
const resolvers = {
    Query: {
        getAllPatients: async () => {
            const data = await PatientModel.find();
            return data;
        },
        getPatientRecord: async (_, { patient_id }) => {
            const data = await PatientModel.findOne({ patient_id }).exec();
            return data;
        },
        getPatientRecordByEmail: async (_, { email }) => {
            const data = await PatientModel.findOne({ email }).exec();
            return data;
        },
        doctors: async () => { },
        getDoctorRecord: async (_, { doctor_id }) => {
            const data = await DoctorModel.findOne({ doctor_id }).exec();
            return data;
        },
    },
    Mutation: {
        // Patient Mutations
        addPatient: async (_, { patient }) => {
            const patient_id = patient.patient_id;
            const fullName = patient.fullName;
            const email = patient.email;
            const type = "Patient";
            const phoneNumber = patient.phoneNumber;
            let pat = new PatientModel({
                patient_id,
                fullName,
                email,
                type,
                phoneNumber,
            });
            let response = await pat.save();
            return "Congrats Data Enterd";
        },
        updatePatient: async (_, { patient }) => {
            const disease = patient.disease;
            PatientModel.findOneAndUpdate({ patient_id: patient.patient_id }, {
                disease: disease,
            }).exec();
            return "Data Updated !!";
        },
        updatePatientInfo: async (_, { patient }) => {
            PatientModel.findOneAndUpdate({ patient_id: patient.patient_id }, {
                fullName: patient.fullName,
                fatherName: patient.fatherName,
                CNICNumber: patient.CNICNumber,
                phoneNumber: patient.phoneNumber,
                address: patient.address,
            }).exec();
            return "Patient Info Updated !!;";
        },
        deletePatient: async (_, { patient_id }) => {
            console.log(patient_id);
            return "Record Deleted";
        },
        // Doctor Mutation
        addDoctor: async (_, { doctor }) => {
            const doctor_id = doctor.doctor_id;
            const name = doctor.name;
            const email = doctor.email;
            const type = "Doctor";
            const phoneNumber = doctor.phoneNumber;
            let doc = new DoctorModel({
                doctor_id,
                name,
                email,
                type,
                phoneNumber,
            });
            let response = await doc.save();
            return "Doctor Registered !!";
        },
        updateDoctor: async (_, { doctor }) => {
            console.log(doctor);
            let a = await DoctorModel.findOneAndUpdate({ doctor_id: doctor.doctor_id }, {
                name: doctor.name,
                email: doctor.email,
                type: doctor.type,
                phoneNumber: doctor.phoneNumber,
                clinicAddress: doctor.clinicAddress,
                CNICNumber: doctor.CNICNumber,
                degree: doctor.degree,
                experience: doctor.experince,
            }).exec();
            return 'Data Update Successfully';
        },
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
async function QQ() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 4000 },
    });
    console.log(`🚀  Server ready at: ${url}`);
}
QQ();
