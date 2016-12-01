<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.0/jquery.min.js"></script>
<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="js/jquery.tablesorter.js"></script>
<?php
require_once("connect_mysql.php");
?>
<?php
//pagination
function search($offset,$pagesize,$name="",$job_type="",$major="",$school="",$event = "",$will="",$count=false)
{
    $db_obj = new ConnectDataBase();//create a new object
    $db_handle = $db_obj->connect();//connect to the database
    $sql = "SELECT * FROM `Student`,`school`,`event`,`student_attend_event`
WHERE `Student`.`school_id`=`school`.`school_id`
AND `student_attend_event`.`student_student_id` = `student`.`student_id`
AND `student_attend_event`.`event_event_id` = `event`.`event_id` ";

    $sql .= $name!=""?"
    AND (`student`.`first_name` = '{$name}'
    OR `student`.`last_name` = '{$name}'
    OR `student`.`major` = '{$name}'
    OR `student`.`GPA` = '{$name}'
    OR `student`.`grad_year` = '{$name}'
    OR `student`.`grad_month` = '{$name}'
    OR `student`.`job_type` = '{$name}'
    OR `school`.`full_name` = '{$name}'
    OR `event`.`event_name` = '{$name}'
    )
    ":"";
    $sql .= $job_type!=""?"AND `job_type` = '{$job_type}'":"";

    if($major != "")
    {
        $sql.=" AND `major` in (";
        foreach($major as $key => $single_major)
        {

            $sql.= "\"".$single_major."\"";
            if($key!= count($major) - 1)
            {
                $sql.=" , ";
            }
        }
        $sql.= ") ";
    }
    if($school != "")
    {
        $sql.=" AND `school`.`full_name` in (";
        foreach($school as $key=> $single_school)
        {

            $sql.= "\"".$single_school."\"";
            if($key!= count($school) - 1)
            {
                $sql.=" , ";
            }
        }
        $sql.= ") ";
    }
    if($event != "")
    {
        $sql.=" AND `event`.`event_name` in (";
        foreach($event as $key=> $single_event)
        {

            $sql.= "\"".$single_event."\"";
            if($key!= count($event) - 1)
            {
                $sql.=" , ";
            }
        }
        $sql.= ") ";
    }

    if($will != "")
    {
        $sql.=" AND `student`.`ITLP_willing` = 1 ";
    }
    if($count==true)
    {
        //var_dump($sql);
        $db_result = $db_handle->query($sql); //list the first 30 items on the specific table
        $rowsC = $db_result->fetchAll();
        return count($rowsC);
    }else{
    $sql.= " ORDER BY `Student`.`student_id` LIMIT $offset,$pagesize ";
    //var_dump($sql);
    $db_result = $db_handle->query($sql); //list the first 30 items on the specific table
    $rows = $db_result->fetchAll();
    return $rows;
    }
}

//load csv
function load_csv($file)
{
    $message = "";
    $db_obj = new ConnectDataBase();//create a new object
    $db_handle = $db_obj->connect();//connect to the database
    fgetcsv($file);//ignore first line
    while(!feof($file))
    {
        $item = fgetcsv($file);
        // manipulate student
        if(!student_exist($db_handle,$item))
        {//no this student
            $result = insert_student($db_handle,$item);
            if($result==true)
            {$message .= "insert student success!\n";
            }else{
                $message .= "insert student failed!\n";
            }

        }else{
            $message .= "student exist!\n";
        }
        //event
        if(!event_exist($db_handle,$item))
        {//no this student
            $result = insert_event($db_handle,$item);
            if($result==true)
            {$message .= "insert event success!\n";
            }else{
                $message .= "insert event failed!\n";
            }
        }else{
            $message .= "event exist!\n";
        }
        $st_id = get_student($db_handle,$item);
        $ev_id = get_event($db_handle,$item);
        //student_attend_event
        if(insert_attend($db_handle,$st_id[0],$ev_id[0]))
        {
            $message .= "insert student_attend_event success!\n";
        }else{
            $message .= "insert student_attend_event failed!\n";
        }
        //school
        if(!school_exist($db_handle,$item))
        {
            $result = insert_school($db_handle,$item);
            if($result==true)
            {$message .= "insert school success!\n";
            }else{
                $message .= "insert school failed!\n";
            }
        }else{
            $message .= "school exist!\n";
        }
        $sc_id = get_school($db_handle,$item);
        //$message .= "++sc_id: ";
        //var_dump($sc_id);

        if(insert_hold($db_handle,$sc_id[0],$ev_id[0]))
        {
            $message .= "insert school_hold_event success!\n";
        }else{
            $message .= "insert school_hold_event failed!\n";
        }

        if(update_student($db_handle,$st_id[0],$sc_id[0]))
        {
            $message .= "update student school_id success!\n";
        }else{
            $message .= "update student school_id failed!\n";
        }

    }
    return $message;
}
//--determine whether exist
function student_exist($db_handle,$student)
{
    $sql = "select * from `student` where `first_name`= '{$student[0]}'AND `last_name` = '{$student[1]}'    AND `email` = '{$student[2]}'AND `major` = '{$student[3]}' AND `degree` = '{$student[4]}' AND `GPA` = '{$student[5]}' AND `grad_year` = {$student[6]} AND `grad_month` = {$student[7]} AND `relocate_willing` = {$student[9]} AND `sponsorship` = {$student[10]} AND `job_type` = '{$student[11]}' ";
    $db_result = $db_handle->query($sql);
    $rows = $db_result->fetchAll();
    if(empty($rows))
        return false;
    else
        return true;
}
function event_exist($db_handle,$student)
{
    $sql = "select * from `event` where `event_date`= '{$student[12]}'AND `event_name` = '{$student[13]}'";
    $db_result = $db_handle->query($sql);
    $rows = $db_result->fetchAll();
    if(empty($rows))
        return false;
    else
        return true;
}

function school_exist($db_handle,$student)
{
    $sql = "select * from `school` where `full_name`= '{$student[8]}'";
    $db_result = $db_handle->query($sql);
    $rows = $db_result->fetchAll();
    if(empty($rows))
        return false;
    else
        return true;
}
function attend_exist($db_handle,$student_id,$event_id)
{
    $sql = "select * from `student_attend_event` where `Student_student_id`= {$student_id} AND `event_event_id` = {$event_id}";

    $db_result = $db_handle->query($sql);
    $rows = $db_result->fetchAll();
    if(empty($rows))
        return false;
    else
        return true;
}
function hold_exist($db_handle,$school_id,$event_id)
{
    $sql = "select * from `school_holds_event` where `school_school_id`= {$school_id} AND `event_event_id` = {$event_id}";
    //var_dump($sql);
    $db_result = $db_handle->query($sql);
    $rows = $db_result->fetchAll();
    if(empty($rows))
        return false;
    else
        return true;
}
//--insert action
function insert_student($db_handle,$student)
{

    $sql_insert   = "insert into `student`
(`first_name`,`last_name`,`email`,`major`,`degree`,`GPA`,`grad_year`,`grad_month`,`relocate_willing`,`sponsorship`,`job_type`,`ITLP_willing`)
values
('{$student[0]}','{$student[1]}','{$student[2]}','{$student[3]}','{$student[4]}','{$student[5]}',{$student[6]},{$student[7]},{$student[9]},{$student[10]},'{$student[11]}','{$student[14]}')";//insert sql sentence with multiple value
   return $db_handle->exec($sql_insert);//insert action
}
function insert_event($db_handle,$student)
{
    $sql_insert   = "insert into `event`
(`event_date`,`event_name`)
values
('{$student[12]}','{$student[13]}')";//insert sql sentence with multiple value
    return $db_handle->exec($sql_insert);//insert action
}

function insert_school($db_handle,$student)
{
    $sql_insert   = "insert into `school`
(`full_name`)
values
('{$student[8]}')";//insert sql sentence with multiple value
    return $db_handle->exec($sql_insert);//insert action
}

function insert_attend($db_handle,$student_id,$event_id)
{
    if(!attend_exist($db_handle,$student_id,$event_id))
    {
        $sql_insert   = "insert into `student_attend_event`
        (`Student_student_id`,`event_event_id`)
        values
        ({$student_id},{$event_id})";//insert sql sentence with multiple value
        return $db_handle->exec($sql_insert);//insert action
    }
}
function insert_hold($db_handle,$school_id,$event_id)
{
    if(!hold_exist($db_handle,$school_id,$event_id))
    {
        $sql_insert   = "insert into `school_holds_event`
        (`school_school_id`,`event_event_id`)
        values
        ({$school_id},{$event_id})";//insert sql sentence with multiple value
        return $db_handle->exec($sql_insert);//insert action
    }
}
//--read
function get_event($db_handle,$student)
{
    $sql = "select `event_id` from `event` where `event_date`= '{$student[12]}'AND `event_name` = '{$student[13]}'";
    $db_result = $db_handle->query($sql);
    $event_id = $db_result->fetch();
    return $event_id;
}
function get_student($db_handle,$student)
{
    $sql = "select `student_id` from `student` where `first_name`= '{$student[0]}'AND `last_name` = '{$student[1]}'    AND `email` = '{$student[2]}'AND `major` = '{$student[3]}' AND `degree` = '{$student[4]}' AND `GPA` = '{$student[5]}' AND `grad_year` = {$student[6]} AND `grad_month` = {$student[7]} AND `relocate_willing` = {$student[9]} AND `sponsorship` = {$student[10]} AND `job_type` = '{$student[11]}' ";
    $db_result = $db_handle->query($sql);
    $student_id = $db_result->fetch();
    return $student_id;
}
function get_school($db_handle,$student)
{
    $sql = "select `school_id` from `school` where `full_name`= '{$student[8]}'";
    $db_result = $db_handle->query($sql);
    $event_id = $db_result->fetch();
    return $event_id;
}
//update 
function update_student($db_handle,$student_id,$school_id)
{
    $sql = "UPDATE `student` SET `school_id` = {$school_id} WHERE `student`.`student_id` = {$student_id}";
    return $db_handle->exec($sql);//insert action
}

?>