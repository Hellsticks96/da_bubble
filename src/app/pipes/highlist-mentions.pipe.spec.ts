import { HighlistMentionsPipe } from "./highlist-mentions.pipe";

describe("HighlistMentionsPipe", () => {
    it("create an instance", () => {
        const pipe = new HighlistMentionsPipe();
        expect(pipe).toBeTruthy();
    });
});
