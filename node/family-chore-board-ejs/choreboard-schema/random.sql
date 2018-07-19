SELECT c.id, c.name FROM chore c LEFT OUTER JOIN assignment a ON c.id=a.chore_id AND a.assigned <= to_date('16 July 2018', 'DD Mon YYYY') AND (a.unassigned is NULL OR to_date('16 July 2018', 'DD Mon YYYY') < unassigned) WHERE a.id IS NULL ;

