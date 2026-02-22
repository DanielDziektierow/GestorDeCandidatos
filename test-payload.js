const candidate = {
    uuid: "348a3846-cd09-4726-910d-76e97b31f548",
    jobId: "4416372005",
    candidateId: "74029415005",
    repoUrl: "https://github.com/DanielDziektierow/GestorDeCandidatos"
};

const BASE_URL = "https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net";

async function testApi(bodyData, name) {
    try {
        const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bodyData)
        });
        const text = await res.text();
        console.log(`Test [${name}] | Status: ${res.status} | Res: ${text}`);
    } catch (err) {
        console.log(`Test [${name}] | Fetch Error: ${err.message}`);
    }
}

async function run() {
    await testApi(candidate, "String exact as submitted");

    await testApi({
        ...candidate,
        jobId: parseInt(candidate.jobId)
    }, "Integer jobId");

    await testApi({
        ...candidate,
        candidateId: parseInt(candidate.candidateId)
    }, "Integer candidateId");

    await testApi({
        ...candidate,
        jobId: parseInt(candidate.jobId),
        candidateId: parseInt(candidate.candidateId)
    }, "Integer both");

    await testApi({
        ...candidate,
        applicationId: candidate.uuid
    }, "Added applicationId=uuid");

    await testApi({
        ...candidate,
        applicationId: candidate.uuid,
        jobId: parseInt(candidate.jobId),
        candidateId: parseInt(candidate.candidateId)
    }, "Added applicationId and integers");
}

run();
