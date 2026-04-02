export interface Project{
    id: number;
    project_name: string;
    work_number: string;
    folder_number: string;
    designer: string | null;
    general_designer: string;
    client: string;
    geodesy: string;
    plan_issue_date: string; // ISO date string (YYYY-MM-DD)
    utility_statement_issue_date: string | null;
    road_construction_permit_date: string;
    water_rights_permit_date: string;
    road_construction_plan: boolean;
    water_network_plan: boolean;
    sewage_plan: boolean;
    stormwater_drainage_plan: boolean;
    public_lighting_plan: boolean;
    other_work_parts: string;
    notes: string;
    min_role_level: number;
}

export interface SimplifiedProject{
    project_id: number;
    name: string;
    plan_issue_date: string
}