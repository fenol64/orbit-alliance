import InstituteActionsPage from '@/components/institute/pages/actions';
import StudentActionsPage from '@/components/student/pages/actions';
import { DatabaseFetcher } from '@/gateway/database';
import { useConfigStore } from '@/store/configStore'

const database = new DatabaseFetcher();

export default async function ActionsPage() {
    const role = await database.getRole();

    if (role === "institute") {
        const { actions } = await database.getInstituteActions();
        return <InstituteActionsPage actions={actions} />;
    }
    else if (role === "student") {
        const { avaliableActions, inProgressActions } = await database.getStudentActions();
        return <StudentActionsPage avaliableActions={avaliableActions} inProgressActions={inProgressActions} />;
    }

    return <div>Ops deu um erro</div>
}
