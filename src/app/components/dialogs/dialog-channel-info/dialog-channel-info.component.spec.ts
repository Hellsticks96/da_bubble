import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DialogChannelInfoComponent } from "./dialog-channel-info.component";

describe("DialogChannelInfoComponent", () => {
    let component: DialogChannelInfoComponent;
    let fixture: ComponentFixture<DialogChannelInfoComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DialogChannelInfoComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DialogChannelInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
